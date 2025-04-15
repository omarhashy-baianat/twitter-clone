import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SearchFilterDto } from './dtos/search-filter.dto';
import { paginationSerializer } from 'src/common/utils/pagination-serializer.util';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class SearchService {
  constructor(
    private usersService: UsersService,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}

  async search(searchFilterDto: SearchFilterDto) {
    let re: any[] = [];
    let count = 0;
    if (searchFilterDto.includeUsers) {
      const [users, usersCount] = await this.usersService.searchUsers(
        searchFilterDto.keyWord,
        searchFilterDto.page,
      );
      count += usersCount;
      re = [...re, ...users];
    }

    if (searchFilterDto.includeComments) {
      const [comments, commentsCounter] =
        await this.commentsService.searchComments(
          searchFilterDto.keyWord,
          searchFilterDto.page,
        );
      count += commentsCounter;
      re = [...re, ...comments];
    }

    if (searchFilterDto.includePosts) {
      const [posts, postsCounter] = await this.postsService.searchPosts(
        searchFilterDto.keyWord,
        searchFilterDto.page,
      );
      count += postsCounter;
      re = [...re, ...posts];
    }

    return paginationSerializer<User | Comment>(
      searchFilterDto.page,
      6,
      count,
      re,
    );
  }
}
