import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActiveDevice {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
