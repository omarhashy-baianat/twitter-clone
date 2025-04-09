import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

@InputType()
export class VerifyUserEmailDto {
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Field()
  otp: string;
}
