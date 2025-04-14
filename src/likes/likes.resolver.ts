import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { LikeData } from './entities/likes.entity';
import { MessageData } from 'src/common/graphql/objects/message.object';

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Query(() => LikeData)
  @UseGuards(IsLoggedIn)
  getUserLike(@Args('postId') id: string, @CurrentUser() user: User) {
    return this.likesService.getLike(id, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => LikeData)
  createLike(@Args('postId') postId: string, @CurrentUser() user: User) {
    return this.likesService.createLike(postId, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  removeLike(@Args('PostId') id: string, @CurrentUser() user: User) {
    return this.likesService.deleteLike(id, user);
  }
}
