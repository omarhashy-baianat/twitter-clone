import { Media } from "src/media/entities/media.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    content: string;
    @ManyToOne(() => Post , post => post.comments)
    post:Post;
    @OneToMany(() => Media, media => media.comment)
    media: Media[];    
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}