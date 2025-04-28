import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveDevice } from './entities/active-devices.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FirebaseAdminService } from './firebase-admin.service';
import { Token } from 'graphql';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ActiveDevice)
    private activeDevicesRepository: Repository<ActiveDevice>,
    private readonly firebaseService: FirebaseAdminService,
  ) {}

  async addActiveDevice(token: string, user: User) {
    const existed = await this.activeDevicesRepository.findOne({
      where: {
        token,
      },
    });
    if (existed?.id) return existed;
    let activeDevice = this.activeDevicesRepository.create({
      user,
      token,
    });
    activeDevice = await this.activeDevicesRepository.save(activeDevice);
    return activeDevice;
  }

  async removeActiveDevice(activeDeviceId: string) {
    const existed = await this.activeDevicesRepository.findOne({
      where: {
        id: activeDeviceId,
      },
    });
    if (existed) await this.activeDevicesRepository.remove(existed);
  }

  async sendNotification(user: User, title: string, body: string) {
    const activeDevices = await this.activeDevicesRepository.find({
      where: {
        user: { id: user.id },
      },
    });

    activeDevices.forEach((activeDevice) => {
      this.sendNotificationMessage(activeDevice, title, body);
    });
  }

  private async sendNotificationMessage(
    activeDevice: ActiveDevice,
    title: string,
    body: string,
  ) {
    if (!activeDevice.token) return;
    const token = activeDevice.token;
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    try {
      const response = await this.firebaseService.messaging.send(message);
      return response;
    } catch (error) {
      // delete the FCM-token if it's invalid!!!!!
      await this.activeDevicesRepository.remove(activeDevice);
    }
  }
}
