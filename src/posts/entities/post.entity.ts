import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Repost } from '../../reposts/entities/repost.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/likes.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { User } from 'src/users/entities/user.entity';
import { SrvRecord } from 'dns';
import { paginationObjectTypeFactory } from 'src/common/graphql/objects/pagination.factory';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  content: string;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  @Field()
  commentsCounter: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  @Field()
  likesCounter: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  @Field()
  repostsCounter: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  @Field()
  bookmarksCounter: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => Media, (media) => media.post)
  @Field(() => [Media], { nullable: true })
  media: Media[];

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.posts)
  // @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @OneToMany(() => Repost, (repost) => repost.post)
  reposts: Repost[];
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
  @OneToMany(() => Bookmark, (bookmark) => bookmark.post)
  bookmarks: Bookmark[];
}

export const PostData = objectTypeFactory<Post>(Post);
export const PostPage = paginationObjectTypeFactory<Post>(Post);
