import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base-model.object';

@ObjectType()
class TestData {
    @Field()
    test: string;
}

@ObjectType()
export class Test extends BaseModel {
    @Field(() => TestData)
    data: TestData;
}
