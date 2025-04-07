import { OtpType } from "src/enums/otp-type.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        length: 6,
        unique: true
    })
    otp: string;
    @OneToOne(() => User, (user) => user.otp)
    @JoinColumn()
    user: User;
    @Column({type: 'enum' , enum: OtpType})
    type: OtpType;
}