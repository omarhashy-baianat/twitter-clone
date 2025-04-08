import { Field, Int, ObjectType } from '@nestjs/graphql';

export function objectTypeFactory<T>(TClass: new () => T) {
  @ObjectType({ isAbstract: true })
  class ResponseWrapper {
    @Field()
    success: Boolean;
    @Field(() => Int)
    statusCode: number;
    @Field()
    message: string;

    @Field(() => TClass)
    data: T;
  }
  Object.defineProperty(ResponseWrapper, 'name', { value: `${TClass.name}Data` });

  return ResponseWrapper;
}
