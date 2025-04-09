import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'username', async: true })
@Injectable()
export class UsernameDoesNotExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    const superAdminUsername = this.configService.getOrThrow(
      'SUPER_ADMIN_USERNAME',
    );
    if (superAdminUsername == value) false;
    const user = await this.usersService.findOneByUsername(value);
    if (user && !user.verified) {
      await this.usersService.removeUser(user);
      return true;
    }
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `User already exist`;
  }
}
