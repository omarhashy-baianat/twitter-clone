import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  CustomRepositoryCannotInheritRepositoryError,
  In,
  Repository,
} from 'typeorm';
import { UserRole } from 'src/enums/user-roles.enum';
import { AuthType } from 'src/enums/auth-type.emum';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { MediaService } from 'src/media/media.service';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  createUserWithEmail(
    email: string,
    username: string,
    password: string | undefined,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    auth: AuthType = AuthType.EMAIL,
    verified: boolean = false,
    role: UserRole = UserRole.USER,
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

  async updateProfile(updateProfileDto: UpdateProfileDto, user: User) {
    const partialUser: Partial<User> = {};

    if (updateProfileDto.profilePictureId) {
      const profilePictureMedia = await this.mediaService.getMediaById(
        updateProfileDto.profilePictureId,
        ['user'],
      );
      if (profilePictureMedia?.user.id != user.id)
        throw new UnauthorizedException('unauthorized access');
      partialUser.profilePicture = profilePictureMedia;
    }

    if (updateProfileDto.coverPictureId) {
      const coverPictureMedia = await this.mediaService.getMediaById(
        updateProfileDto.coverPictureId,
        ['user'],
      );

      if (coverPictureMedia?.user.id != user.id)
        throw new UnauthorizedException('unauthorized access');
      partialUser.coverPicture = coverPictureMedia;
    }

    partialUser.bio = updateProfileDto.bio;
    partialUser.firstName = updateProfileDto.firstName;
    partialUser.lastName = updateProfileDto.lastName;

    return this.updateUser(user, partialUser);
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { email }, relations });
  }

  findManyByIds(ids: (string | null)[]) {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findOneByUsername(username: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { username }, relations });
  }

  findOneById(id: string, relations: string[] = []) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  updateUser(user: User, partialUser: Partial<User> = {}) {
    const updatedUser = this.userRepository.merge(user, partialUser);
    return this.userRepository.save(updatedUser);
  }

  removeUser(user: User) {
    return this.userRepository.remove(user);
  }
}
