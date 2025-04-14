import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowsService } from './follows.service';
import { FollowData } from './entity/follow.entity';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MessageData } from 'src/common/graphql/objects/message.object';

@Resolver()
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Query(() => FollowData)
  getFollow(
    @Args('followingId') followingId: string,
    @CurrentUser() user: User,
  ) {
    return this.followsService.getFollow(followingId, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => FollowData)
  createFollow(@Args('followingId') id: string, @CurrentUser() user: User) {
    return this.followsService.createFollow(id, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  deleteFollow(@Args('followingId') id: string, @CurrentUser() user: User) {
    return this.followsService.deleteFollow(id, user);
  }
}
