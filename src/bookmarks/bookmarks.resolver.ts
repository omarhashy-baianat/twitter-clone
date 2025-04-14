import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookmarksService } from './bookmarks.service';
import { BookmarkData } from './entities/bookmark.entity';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { MessageData } from 'src/common/graphql/objects/message.object';

@Resolver()
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Query(() => BookmarkData)
  @UseGuards(IsLoggedIn)
  getUserBookmark(@Args('postId') id: string, @CurrentUser() user: User) {
    return this.bookmarksService.getBookmark(id, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => BookmarkData)
  async createBookmark(
    @Args('postId') postId: string,
    @CurrentUser() user: User,
  ) {
    return this.bookmarksService.createBookmark(postId, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  removeBookmark(@Args('PostId') id: string, @CurrentUser() user: User) {
    return this.bookmarksService.deleteBookmark(id, user);
  }
}
