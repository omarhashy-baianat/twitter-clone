import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Repost } from '../../reposts/entities/repost.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/likes.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Media, (media) => media.post)
  media: Media;
  @OneToMany(() => Repost, (repost) => repost.post)
  reposts: Repost[];
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
  @OneToMany(() => Bookmark, (bookmark) => bookmark.post)
  bookmarks: Bookmark[];
}
