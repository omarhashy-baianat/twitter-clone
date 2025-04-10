import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

@InputType()
export class LoginWithGoogleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Field()
  token: string;
}
