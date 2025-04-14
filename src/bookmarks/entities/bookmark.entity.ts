import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => Post, (post) => post.bookmarks)
  @Field(() => Post)
  post: Post;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field()
  createAt: Date;
}

export const BookmarkData = objectTypeFactory<Bookmark>(Bookmark);
