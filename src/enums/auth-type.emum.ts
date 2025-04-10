import { registerEnumType } from "@nestjs/graphql";

export enum AuthType {
  GOOGLE,
  EMAIL,
}
registerEnumType(AuthType, { name: 'AuthType' });
