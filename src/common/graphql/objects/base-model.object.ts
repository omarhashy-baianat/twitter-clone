import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field()
  success: Boolean;
  @Field(() => Int)
  statusCode: number;
  @Field()
  message: string;

}
