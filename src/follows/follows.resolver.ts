import { Resolver } from '@nestjs/graphql';
import { FollowsService } from './follows.service';

@Resolver()
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}
}
