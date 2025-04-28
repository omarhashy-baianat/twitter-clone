import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { PostData, PostPage } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { MessageData } from 'src/common/graphql/objects/message.object';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => PostData)
  getPost(@Args('id') id: string) {
    return this.postsService.getPost(id);
  }

  @UseGuards(IsLoggedIn)
  @Query(() => PostPage)
  getTimeLine(
    @CurrentUser() currentUser: User,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
  ) {
    return this.postsService.getFollowingPosts(currentUser, page);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => PostData)
  createPost(
    @Args('postData') createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.createPost(createPostDto, currentUser);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => PostData)
  updatePost(
    @Args('updatePostData') updatePostDto: UpdatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.updatePost(updatePostDto, currentUser);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  deletePost(@Args('postId') postId: string, @CurrentUser() user: User) {
    return this.postsService.deletePost(postId, user);
  }
}
