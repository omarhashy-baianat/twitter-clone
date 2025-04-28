import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveDevice } from './entities/active-devices.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ActiveDevice)
    private activeDevicesRepository: Repository<ActiveDevice>,
    private readonly firebaseService: FirebaseAdminService,
  ) {}

  async addActiveDevice(
    token: string,
    user: User,
  ) {
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
    const tokens = await this.activeDevicesRepository.find({
      where: {
        user: { id: user.id },
      },
    });

    tokens.forEach(({ token }) => {
      this.sendNotificationMessage(token, title, body);
    });
  }

  private async sendNotificationMessage(
    token: string,
    title: string,
    body: string,
  ) {
    if (!token) return;
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
      console.error(error);
    }
  }
}
