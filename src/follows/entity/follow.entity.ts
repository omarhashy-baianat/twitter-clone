import { User } from "src/users/entities/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => User , (user) => user.following)
    following: User;
    @ManyToOne(() => User , (user) => user.followers)
    follower: User;
    @CreateDateColumn()
    createdAt: Date;
}