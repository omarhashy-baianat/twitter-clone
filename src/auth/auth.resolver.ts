import { Resolver , Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }
    @Query(() => String)
    sayHello() {
      throw new UnauthorizedException()
      return "Hello, world"
    }
}
