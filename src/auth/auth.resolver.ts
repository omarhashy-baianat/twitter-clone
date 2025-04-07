import { Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  sayHello() {
    return 'Hello, world';
  }
  @Query(() => String)
  testException() {
    throw new NotFoundException()
    return 'Hello, world';
  }
}