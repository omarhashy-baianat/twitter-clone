import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Like, LikeData } from './entities/likes.entity';

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => LikeData)
  createLike(@Args('postId') postId: string, @CurrentUser() user: User) {
    return this.likesService.createLike(postId, user);
  }
}

