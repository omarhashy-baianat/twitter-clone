import { MediaType } from "src/enums/media-type.enum"
import { UserRole } from "src/enums/user-roles.enum"
import { Post } from "src/posts/entities/post.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    fileName : string
    @Column({
        type: 'enum',
        enum: MediaType,
      }) 
    type: MediaType
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    @ManyToOne(() => Post , (post) => post.id)
    post: Post;
}