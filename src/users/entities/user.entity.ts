import { Otp } from 'src/auth/entities/otp.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { UserRole } from 'src/enums/user-roles.enum';
import { Like } from 'src/likes/entities/likes.entity';
import { Media } from 'src/media/entities/media.entity';
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
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column({ length: 20 })
  username: string;
  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  @Column({ length: 20 })
  firstName: string;
  @Column({ length: 20 })
  lastName: string;
  @Column({ type: 'date' })
  dateOfBirth: Date;
  @Column({ nullable: true })
  bio: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToOne(() => Media)
  @JoinColumn()
  profilePicture: Media;
  @OneToOne(() => Media)
  @JoinColumn()
  coverPicture: string;
  @OneToMany(() => Like, (like) => like.user)
  likes: Like;
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment;
  @OneToMany(() => Bookmark , bookmark => bookmark.user)
  bookmarks: Bookmark[];
  @OneToOne(() => Otp , (otp) => otp.user)
  otp: Otp;
}
