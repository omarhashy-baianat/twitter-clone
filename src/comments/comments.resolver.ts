import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { Comment, CommentData, CommentPage } from './entities/comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { MessageData } from 'src/common/graphql/objects/message.object';
import { DataloaderService } from 'src/dataloader/dataloader.service';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private dataloaderService: DataloaderService,
  ) {}

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => CommentData)
  createComment(
    @Args('commentData') createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => CommentData)
  updateComment(
    @Args('commentData') updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.updateComment(updateCommentDto, user);
  }

  @Transactional()
  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  deleteComment(@Args('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.deleteComment(id, user);
  }

  @Query(() => CommentData)
  getComment(@Args('id') id: string) {
    return this.commentsService.getComment(id);
  }

  @Query(() => CommentPage)
  getPostComment(
    @Args('postId') postId: string,
    @Args('Page', { nullable: true }) page: number,
  ) {
    return this.commentsService.getPostComments(postId, page);
  }

  @ResolveField(() => User)
  user(@Parent() comment: Comment, @Context() context: any) {
    if (comment.user) return comment.user;
    const loader = this.dataloaderService.getCommentUserDataloader(context);
    return loader.load(comment.id);
  }
}
