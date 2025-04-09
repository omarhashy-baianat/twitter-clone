import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { EmailDoesNotExistValidator } from '../validators/email-does-not-exist.validator';
import { UsernameDoesNotExistValidator } from '../validators/username-does-not-exist.validator';
import { ageValidator } from '../validators/age-validator.validator';

@InputType()
export class RegisterWithEmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @Field()
  lastName: string;

  @IsDate()
  @Field(() => Date)
  @Validate(ageValidator)
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  @Validate(UsernameDoesNotExistValidator)
  username: string;

  @IsEmail()
  @Field()
  @Validate(EmailDoesNotExistValidator)
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(5)
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  password: string;
}
