import { createUnionType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { paginationObjectTypeFactory } from 'src/common/graphql/objects/pagination.factory';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

const SearchUnion = createUnionType({
  name: 'SearchUnion',
  types: () => [Post, Comment, User],
});

export const SearchUnionData =
  paginationObjectTypeFactory(SearchUnion);
