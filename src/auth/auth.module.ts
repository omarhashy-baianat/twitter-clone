import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { EmailDoesNotExistValidator } from './validators/email-does-not-exist.validator';
import { UsernameDoesNotExistValidator } from './validators/username-does-not-exist.validator';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    EmailDoesNotExistValidator,
    UsernameDoesNotExistValidator,
  ],
  imports: [UsersModule],
})
export class AuthModule {}
