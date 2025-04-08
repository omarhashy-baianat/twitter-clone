import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestData } from 'src/common/graphql/objects/test.object';
import { UserData } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserData)
  seedSuperAdmin() {
    return this.authService.seedSuperAdmin();
  }

  @Query(() => TestData)
  sayHello() {
    return {
      test: 'value',
    };
  }
  @Query(() => String)
  testException() {
    throw new BadRequestException();
    return {
      success: true,
      statusCode: 200,
      message: 'Hello!',
      data: { test: 'value' },
    };
  }
}
