import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
  constructor(private usersService: UsersService) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    const user = await this.usersService.findOneByUsername(value);
    if (user) throw new UnprocessableEntityException('User already exist');
    return true;
  }
}
