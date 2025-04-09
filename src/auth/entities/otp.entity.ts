import { OtpType } from 'src/enums/otp-type.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 6,
  })
  otp: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @OneToOne(() => User, (user) => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
