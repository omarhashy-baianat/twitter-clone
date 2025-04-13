import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { CommentData } from './entities/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => CommentData)
  createComment(
    @Args('commentData') createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, user);
  }
}
