import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UserData } from './entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => UserData)
  @Transactional()
  @UseGuards(IsLoggedIn)
  updateUserProfile(
    @Args('profileData') updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateProfile(updateProfileDto, user);
  }
}
