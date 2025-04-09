import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MessageData } from 'src/common/graphql/objects/test.object';
import { UserData } from 'src/users/entities/user.entity';
import { RegisterWithEmailDto } from './Dtos/register-with-email.dto';
import { Transactional } from 'typeorm-transactional';
import { VerifyUserEmailDto } from './Dtos/verify-user-email.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserData)
  seedSuperAdmin() {
    return this.authService.seedSuperAdmin();
  }

  @Mutation(() => UserData)
  @Transactional()
  registerWithEmail(
    @Args('userData') registerWithEmailDto: RegisterWithEmailDto,
  ) {
    return this.authService.registerUserByEmail(registerWithEmailDto);
  }

  @Mutation(() => UserData)
  @Transactional()
  verifyUserEmail(@Args('otpData') verifyUserEmailDto: VerifyUserEmailDto) {
    return this.authService.verifyUserEmail(verifyUserEmailDto);
  }

  @Query(() => MessageData)
  sayHello() {
    return {
      message: 'Hello, world',
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
