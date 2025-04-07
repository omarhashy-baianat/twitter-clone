import { Resolver } from '@nestjs/graphql';
import { RepostsService } from './reposts.service';

@Resolver()
export class RepostsResolver {
  constructor(private readonly repostsService: RepostsService) {}
}
