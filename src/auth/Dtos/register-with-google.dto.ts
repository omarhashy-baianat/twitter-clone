import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UsernameDoesNotExistValidator } from '../validators/username-does-not-exist.validator';
import { ageValidator } from '../validators/age-validator.validator';

@InputType()
export class RegisterWithGoogleDto {
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

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Field()
  token: string;
}
