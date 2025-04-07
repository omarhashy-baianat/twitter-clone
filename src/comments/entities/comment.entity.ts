import { Media } from "src/media/entities/media.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    content: string;
    @ManyToOne(() => Post , post => post.comments)
    post:Post;
    // @OneToMany()
    // media: Media;    
}