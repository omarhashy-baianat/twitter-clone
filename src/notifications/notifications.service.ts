import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveDevices } from './entities/active-devices.entity';
import { Repository } from 'typeorm';
import { SubscribeToNotificationsDto } from './dtos/subscribe-to-notifications.dto';
import { User } from 'src/users/entities/user.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ActiveDevices)
    private activeDevicesRepository: Repository<ActiveDevices>,
    private readonly firebaseService: FirebaseAdminService,
  ) {}

  async addActiveDevice(
    subscribeToNotificationsDto: SubscribeToNotificationsDto,
    user: User,
  ) {
    const existed = await this.activeDevicesRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });
    if (existed) await this.activeDevicesRepository.remove(existed);
    const activeDevice = this.activeDevicesRepository.create({
      user,
      token: subscribeToNotificationsDto.token,
    });
    await this.activeDevicesRepository.save(activeDevice);
    return {
      message: 'subscription created successfully ',
    };
  }

  async sendNotification(user: User, title: string, body: string) {
    const token = (
      await this.activeDevicesRepository.findOne({
        where: {
          user: { id: user.id },
        },
      })
    )?.token;
    if (!token) return; //user did not subscribe for notifications
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
