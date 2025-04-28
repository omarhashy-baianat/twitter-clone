import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveDevice } from './entities/active-devices.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  providers: [NotificationsService, FirebaseAdminService],
  imports: [TypeOrmModule.forFeature([ActiveDevice])],
  exports: [NotificationsService],
})
export class NotificationsModule {}
