import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';

@Entity()
@ObjectType()
export class Repost {
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

  @ManyToOne(() => User, (user) => user.reposts)
  @Field(() => User)
  user: User;

  @OneToMany(() => Media, (media) => media.repost)
  @Field(() => [Media], { nullable: true })
  media: Media[];

  @ManyToOne(() => Post, (post) => post.reposts)
  @Field(() => Post)
  post: Post;
}

export const RepostData = objectTypeFactory<Repost>(Repost);
