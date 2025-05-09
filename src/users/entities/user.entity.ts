import { Field, ObjectType } from '@nestjs/graphql';
import { Otp } from 'src/auth/entities/otp.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { objectTypeFactory } from 'src/common/graphql/objects/base-model.object';
import { AuthType } from 'src/enums/auth-type.emum';
import { UserRole } from 'src/enums/user-roles.enum';
import { Follow } from 'src/follows/entity/follow.entity';
import { Like } from 'src/likes/entities/likes.entity';
import { Media } from 'src/media/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repost } from 'src/reposts/entities/repost.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ length: 20, unique: true })
  @Field()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.EMAIL,
  })
  @Field(() => AuthType)
  auth: AuthType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ length: 20 })
  @Field()
  firstName: string;

  @Column({ length: 20 })
  @Field()
  lastName: string;

  @Column()
  @Field(() => Date)
  dateOfBirth: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio: string;

  @Column({ default: false })
  @Field()
  verified: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToOne(() => Media, (media) => media.userProfilePicture)
  @JoinColumn()
  profilePicture: Media;

  @OneToOne(() => Media, (media) => media.userCoverPicture)
  @JoinColumn()
  coverPicture: Media;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToOne(() => Otp, (otp) => otp.user)
  otp: Otp;

  @OneToMany(() => Follow, (follow) => follow.id)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.id)
  following: Follow[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Repost, (repost) => repost.user)
  reposts: Repost[];
}

export const UserData = objectTypeFactory<User>(User);
