import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  CustomRepositoryCannotInheritRepositoryError,
  Repository,
} from 'typeorm';
import { UserRole } from 'src/enums/user-roles.enum';
import { AuthType } from 'src/enums/auth-type.emum';

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
    auth: AuthType = AuthType.EMAIL,
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
      auth,
    });
    return this.userRepository.save(user);
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { email }, relations });
  }

  findOneByUsername(username: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { username }, relations });
  }

  findOneById(id: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  updateUser(user: User, partialUser: Partial<User>) {
    const updatedUser = this.userRepository.merge(user, partialUser);
    return this.userRepository.save(updatedUser);
  }

  removeUser(user: User) {
    return this.userRepository.remove(user);
  }
}
