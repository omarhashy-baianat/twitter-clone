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
export class Like {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => Post, (post) => post.likes)
  @Field(() => Post)
  post: Post;

  @ManyToOne(() => User, (user) => user.likes)
  @Field(() => User)
  user: User;
  
  @CreateDateColumn()
  createdAt: Date;
}

export const LikeData = objectTypeFactory<Like>(Like);
