import { registerEnumType } from "@nestjs/graphql";

export enum MediaType {
    VIDEO,
    IMAGE
}

registerEnumType(MediaType, { name: 'MediaType' });
