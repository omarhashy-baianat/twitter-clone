import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'dateOfBirth' })
@Injectable()
export class ageValidator implements ValidatorConstraintInterface {
  async validate(value: Date, validationArguments?: ValidationArguments) {
    const thirteenYearsAgo = moment().subtract(13, 'years').toDate();    
    return value.getTime() <= thirteenYearsAgo.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `User can not be less than 13 years old`;
  }
}
