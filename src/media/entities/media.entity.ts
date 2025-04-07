import { MediaType } from "src/enums/media-type.enum"
import { UserRole } from "src/enums/user-roles.enum"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    fileName : string
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NOT_ADMIN
      }) 
    type: MediaType
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
}