import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
  @ManyToOne(() => User , (user) => user.likes)
  user: User;
  @CreateDateColumn()
  createdAt: Date;
}
