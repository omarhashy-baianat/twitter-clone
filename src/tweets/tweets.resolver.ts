import { Resolver } from '@nestjs/graphql';
import { TweetsService } from './tweets.service';

@Resolver()
export class TweetsResolver {
  constructor(private readonly tweetsService: TweetsService) {}
}
