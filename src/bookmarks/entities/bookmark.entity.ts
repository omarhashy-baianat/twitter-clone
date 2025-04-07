import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createAt: Date;
    @ManyToOne(() => Post , post => post.bookmarks)
    post: Post;
    @ManyToOne(() => User, (user) => user.bookmarks )
    user: User;
}