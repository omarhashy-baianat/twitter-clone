import { registerEnumType } from "@nestjs/graphql";

export enum MediaTarget {
    PROFILE_PICTURE,
    PROFILE_COVER,
    COMMENT,
    POST,
    REPOST,
}

registerEnumType(MediaTarget, { name: 'MediaTarget' });
