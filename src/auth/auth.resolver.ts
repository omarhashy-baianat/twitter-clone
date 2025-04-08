import { Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';
import { Test } from 'src/common/graphql/objects/test.object';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Test)
  sayHello() {
    return {
      test: 'value',
    };
  }
  @Query(() => String)
  testException() {
    throw new NotFoundException();
    return {
      success: true,
      statusCode: 200,
      message: 'Hello!',
      data: { test: 'value' },
    };
  }
}
