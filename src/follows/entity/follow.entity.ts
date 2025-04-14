import { Field, ObjectType } from '@nestjs/graphql';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => User, (user) => user.following)
  @Field(() => User)
  following: User;

  @ManyToOne(() => User, (user) => user.followers)
  @Field(() => User)
  follower: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}

export const FollowData = objectTypeFactory<Follow>(Follow);
