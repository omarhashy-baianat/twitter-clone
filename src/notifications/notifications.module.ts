import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveDevices } from './entities/active-devices.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  providers: [
    NotificationsResolver,
    NotificationsService,
    FirebaseAdminService,
  ],
  imports: [TypeOrmModule.forFeature([ActiveDevices])],
  exports: [NotificationsService],
})
export class NotificationsModule {}
