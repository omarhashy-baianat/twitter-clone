import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Follow } from './entity/follow.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    private usersService: UsersService,
  ) {}

  async createFollow(followingId: string, user: User) {
    //user is the follower
    const following = await this.usersService.findOneById(followingId);
    if (!following) throw new BadRequestException('invalid followingId');
    if (followingId === user.id)
      throw new BadRequestException('user can not follow himself');

    const existedLike = await this.getFollowByFollowerAndFollowing(
      user,
      following,
    );
    if (existedLike) throw new BadRequestException('follow already exist');
    const follow = this.followRepository.create({
      follower: user,
      following,
    });
    return this.followRepository.save(follow);
  }

  async deleteFollow(followingId: string, user: User) {
    const following = await this.usersService.findOneById(followingId);
    if (!following) throw new BadRequestException('invalid followingId');

    const follow = await this.getFollowByFollowerAndFollowing(following, user);
    if (!follow) throw new BadRequestException('follow does not exist');

    await this.followRepository.remove(follow);

    return {
      message: 'follow removed successfully',
    };
  }

  getFollowByFollowerAndFollowing(
    follower: User,
    following: User,
    relations: string[] = [],
  ) {
    return this.followRepository.findOne({
      where: {
        follower,
        following,
      },
      relations: [...new Set([...['follower', 'following'], ...relations])],
    });
  }
}
