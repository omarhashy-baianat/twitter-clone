import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUserWithEmail(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    role: UserRole = UserRole.USER,
    verified: boolean = false,
  ) {
    const user = this.userRepository.create({
      email,
      username,
      role,
      firstName,
      lastName,
      password,
      dateOfBirth,
      verified,
    });
    return this.userRepository.save(user);
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { email }, relations });
  }

  findOneByUsername(email: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { email }, relations });
  }
}
