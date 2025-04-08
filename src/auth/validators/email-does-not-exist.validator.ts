import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
  constructor(private usersService: UsersService) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    const user = await this.usersService.findOneByEmail(value);
    if (user) throw new UnprocessableEntityException('User already exist');
    return true;
  }
}
