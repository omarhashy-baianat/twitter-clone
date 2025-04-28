import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class LoginWithEmailDto {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  fcmToken?: string;
}
