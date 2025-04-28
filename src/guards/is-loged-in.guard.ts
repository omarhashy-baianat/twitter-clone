import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsLoggedIn implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('unauthorized access');
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded.userId) throw new Error();
      const user = await this.usersService.findOneById(decoded.userId);
      if (!user) throw new Error();

      request.user = user;
      if (decoded.activeDeviceId)
        request.activeDeviceId = decoded.activeDeviceId;
      return true;
    } catch (error) {
      throw new UnauthorizedException('unauthorized access');
    }
  }
}
