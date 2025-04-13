import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { Media } from 'src/media/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User)
  user: User;

  @OneToMany(() => Media, (media) => media.comment)
  @Field(() => [Media], { nullable: true })
  media: Media[];

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}

export const CommentData = objectTypeFactory<Comment>(Comment);
