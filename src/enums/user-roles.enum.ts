import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  SUPER_ADMIN,
  ADMIN,
  USER,
}

registerEnumType(UserRole, { name: 'UserRole' });
