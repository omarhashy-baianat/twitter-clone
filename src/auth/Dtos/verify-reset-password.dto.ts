import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class VerifyResetPasswordDto {
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Field()
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(5)
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  password: string;
}
