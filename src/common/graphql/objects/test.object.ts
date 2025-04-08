import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from './base-model.object';

@ObjectType()
class Test {
    @Field()
    test: string;
}
export const TestData = objectTypeFactory<Test>(Test)