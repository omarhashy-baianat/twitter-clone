import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './pageInfo.object';
import { objectTypeFactory } from './base-model.object';

export function paginationObjectTypeFactory<T>(TClass: any) {
  @ObjectType({ isAbstract: true })
  class ResponseWrapper {
    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => [TClass], { nullable: true })
    items: (typeof TClass)[];
  }
  Object.defineProperty(ResponseWrapper, 'name', {
    value: `${TClass.name}Page`,
  });
  return objectTypeFactory<ResponseWrapper>(ResponseWrapper);
}
