import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Transactional } from 'typeorm-transactional';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { PostData } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => PostData)
  createPost(
    @Args('postData') createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.createPost(createPostDto, currentUser);
  }
}
