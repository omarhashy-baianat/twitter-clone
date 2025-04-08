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

@Entity()
export class Repost {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Media, (media) => media.repost)
  media: Media;
  @ManyToOne(() => Post, (post) => post.reposts)
  post: Post;
}
