import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class EmailDoesNotExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    const superAdminEmail = this.configService.getOrThrow('SUPER_ADMIN_EMAIL');
    if (superAdminEmail == value) throw false;
    const user = await this.usersService.findOneByEmail(value);
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
