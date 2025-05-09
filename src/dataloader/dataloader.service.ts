import { Global, Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CommentsService } from 'src/comments/comments.service';
import { RowComments } from 'src/common/types/row-comment.type';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Global()
@Injectable()
export class DataloaderService {
  constructor(
    private usersService: UsersService,
    private commentsService: CommentsService,
  ) {}
  private async getUsers(userIds: (string | null)[]) {
    const users = await this.usersService.findManyByIds(userIds);
    const usersMap: Record<string, User> = users.reduce(
      (map, user) => {
        map[user.id] = user;
        return map;
      },
      {} as Record<string, User>,
    );
    return userIds.map((userId) => {
      const user = userId ? usersMap[userId] || null : null;
      if (!user) throw new Error();
      return user;
    });
  }

  getCommentUserDataloader(context: any): DataLoader<string, User> {
    if (!context.commentUserDataloader) {
      context.commentUserDataloader = new DataLoader<string, User>(
        async (commentIds: string[]) => {
          const rowComments: RowComments[] =
            await this.commentsService.findRowCommentsByIds(commentIds);
          const rowCommentsMap: Record<string, RowComments> =
            rowComments.reduce(
              (map, rowComment) => {
                map[rowComment.comment_id] = rowComment;
                return map;
              },
              {} as Record<string, RowComments>,
            );
          const userIds = commentIds.map(
            (commentId) => rowCommentsMap[commentId].comment_userId || null,
          );
          return this.getUsers(userIds);
        },
      );
    }
    return context.commentUserDataloader;
  }

  getUsersDataLoader(context: any): DataLoader<string, User> {
    if (!context.usersDataLoader) {
      context.usersDataLoader = new DataLoader<string, User>(
        async (userIds: string[]) => this.getUsers(userIds),
      );
    }
    return context.usersDataLoader; 
  }
}
