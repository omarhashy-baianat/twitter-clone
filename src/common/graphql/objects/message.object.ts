import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from './base-model.object';

@ObjectType()
class Message {
    @Field()
    message: string;
}
export const MessageData = objectTypeFactory<Message>(Message)