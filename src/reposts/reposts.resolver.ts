import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RepostsService } from './reposts.service';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { RepostData } from './entities/repost.entity';
import { CreateRepostDto } from './dtos/create-repost.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateRepostDto } from './dtos/update-repost.dto';
import { MessageData } from 'src/common/graphql/objects/message.object';

@Resolver()
export class RepostsResolver {
  constructor(private readonly repostsService: RepostsService) {}

  @Query(() => RepostData)
  getRepost(@Args('id') id: string) {
    return this.repostsService.getRepost(id);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => RepostData)
  createRepost(
    @Args('repostData') repostData: CreateRepostDto,
    @CurrentUser() user: User,
  ) {
    return this.repostsService.createRepost(repostData, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => RepostData)
  updateRepost(
    @Args('repostData') repostData: UpdateRepostDto,
    @CurrentUser() user: User,
  ) {
    return this.repostsService.updateRepost(repostData, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  deleteRepost(@Args('id') id: string, @CurrentUser() user: User) {
    return this.repostsService.deleteRepost(id, user);
  }
}
