import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { MediaTarget } from 'src/enums/media-target.enum';
import { MediaType } from 'src/enums/media-type.enum';
import { Post } from 'src/posts/entities/post.entity';
import { Repost } from 'src/reposts/entities/repost.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  fileName: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  @Field(() => MediaType)
  type: MediaType;

  @Column({
    type: 'enum',
    enum: MediaTarget,
  })
  @Field(() => MediaTarget)
  target: MediaTarget;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Field()
  get mediaUrl(): string {
    return `/files/${this.fileName}`;
  }

  @ManyToOne(() => User, { nullable: false })
  user: User;
  
  @ManyToOne(() => Post, (post) => post.id)
  post: Post;
  @ManyToOne(() => Repost, (repost) => repost.media)
  repost: Repost;
  @ManyToOne(() => Comment, (comment) => comment.media)
  comment: Comment;
}

export const MediaData = objectTypeFactory<Media>(Media);
