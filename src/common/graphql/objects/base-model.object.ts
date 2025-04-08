import { Field, Int, ObjectType } from '@nestjs/graphql';

export function objectTypeFactory<T>(TClass: new () => T) {
  @ObjectType()
  class BaseModel {
    @Field()
    success: Boolean;
    @Field(() => Int)
    statusCode: number;
    @Field()
    message: string;

    @Field(() => TClass)
    data: T;
  }
  return BaseModel;
}
