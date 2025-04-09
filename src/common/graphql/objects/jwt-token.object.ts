import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from './base-model.object';

@ObjectType()
class jwtToken {
  @Field()
  token: string;
}
export const jwtTokenData = objectTypeFactory<jwtToken>(jwtToken);
