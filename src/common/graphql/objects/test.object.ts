import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from './base-model.object';

@ObjectType()
class TestData {
    @Field()
    test: string;
}
export const Test = objectTypeFactory<TestData>(TestData)