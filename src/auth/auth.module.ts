import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { EmailDoesNotExistValidator } from './validators/email-does-not-exist.validator';
import { UsernameDoesNotExistValidator } from './validators/username-does-not-exist.validator';
import { OtpService } from './otp.servise';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { QueueModule } from 'src/queue/queue.module';
import { GoogleAuthService } from './google-auth.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    EmailDoesNotExistValidator,
    UsernameDoesNotExistValidator,
    OtpService,
    GoogleAuthService,
  ],
  imports: [TypeOrmModule.forFeature([Otp]), QueueModule, NotificationsModule],
})
export class AuthModule {}
