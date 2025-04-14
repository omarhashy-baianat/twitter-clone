import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './pageInfo.object';
import { objectTypeFactory } from './base-model.object';

export function paginationObjectTypeFactory<T>(TClass: new () => T) {
  @ObjectType({ isAbstract: true })
  class ResponseWrapper {
    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => [TClass], { nullable: true })
    items: T[];
  }
  return objectTypeFactory<ResponseWrapper>(ResponseWrapper);
}
