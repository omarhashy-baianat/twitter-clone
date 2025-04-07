import { UserRole } from 'src/enums/user-roles.enum';
import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column({ length: 20 })
  username: string;
  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  }) 
  role: UserRole;
  @Column({length: 20})
  firstName: string;
  @Column({length: 20})
  lastName: string;
  @Column({type: 'date'})
  dateOfBirth: Date;
  @Column({nullable: true})
  bio: string;
  @OneToOne(() => Media)
  @JoinColumn()
  profilePicture: Media;
  @OneToOne(() => Media)
  @JoinColumn()
  coverPicture: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
