import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class LoginWithGoogleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Field()
  token: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  fcmToken?: string;
}
