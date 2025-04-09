import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

@InputType()
export class ResetUserPasswordDto {
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @Field()
  email: string;
}
