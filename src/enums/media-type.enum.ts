import { registerEnumType } from "@nestjs/graphql";

export enum MediaType {
    VIDEO,
    PHOTO
}

registerEnumType(MediaType, { name: 'MediaType' });
