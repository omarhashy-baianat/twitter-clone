import { Resolver , Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }
    @Query(() => String)
    sayHello() {
      return "Hello, world"
    }
}
