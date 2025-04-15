import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SubscribeToNotificationsDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  token: string;
}
