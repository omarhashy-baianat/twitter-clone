import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { MessageData } from 'src/common/graphql/objects/message.object';
import { User, UserData } from 'src/users/entities/user.entity';
import { RegisterWithEmailDto } from './Dtos/register-with-email.dto';
import { Transactional } from 'typeorm-transactional';
import { VerifyUserEmailDto } from './Dtos/verify-user-email.dto';
import { ResetUserPasswordDto } from './Dtos/reset-user-password.dto';
import { VerifyResetPasswordDto } from './Dtos/verify-reset-password.dto';
import { jwtTokenData } from 'src/common/graphql/objects/jwt-token.object';
import { LoginWithEmailDto } from './Dtos/login-with-email.dto';
import { RegisterWithGoogleDto } from './Dtos/register-with-google.dto';
import { LoginWithGoogleDto } from './Dtos/login-with-google.dto';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ActiveDevice } from 'src/decorators/get-active-device-id.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserData)
  @Transactional()
  seedSuperAdmin() {
    return this.authService.seedSuperAdmin();
  }

  @Mutation(() => UserData)
  @Transactional()
  registerWithEmail(
    @Args('userData') registerWithEmailDto: RegisterWithEmailDto,
  ) {
    return this.authService.registerUserByEmail(registerWithEmailDto);
  }

  @Mutation(() => UserData)
  @Transactional()
  async registerWithGoogle(
    @Args('usrData') registerWithGoogleDto: RegisterWithGoogleDto,
  ) {
    return this.authService.registerUserWithGoogle(registerWithGoogleDto);
  }

  @Mutation(() => UserData)
  @Transactional()
  verifyUserEmail(@Args('otpData') verifyUserEmailDto: VerifyUserEmailDto) {
    return this.authService.verifyUserEmail(verifyUserEmailDto);
  }

  @Mutation(() => MessageData)
  @Transactional()
  resetUserPassword(
    @Args('userData') resetUserPasswordDto: ResetUserPasswordDto,
  ) {
    return this.authService.resetUserPassword(resetUserPasswordDto);
  }

  @Mutation(() => UserData)
  @Transactional()
  async verifyResetUserPassword(
    @Args('newPasswordData') verifyResetUserPasswordDto: VerifyResetPasswordDto,
  ) {
    return this.authService.verifyResetUserPassword(verifyResetUserPasswordDto);
  }

  @Mutation(() => jwtTokenData)
  @Transactional()
  async loginWithEmail(
    @Args('userCredentialsData') loginWithEmailDto: LoginWithEmailDto,
  ) {
    return this.authService.loginWithEmail(loginWithEmailDto);
  }

  @Mutation(() => jwtTokenData)
  @Transactional()
  async loginWithGoogle(
    @Args('userCredentialsData') loginWithGoogleDto: LoginWithGoogleDto,
  ) {
    return this.authService.loginWithGoogle(loginWithGoogleDto);
  }

  @UseGuards(IsLoggedIn)
  @Mutation(() => MessageData)
  async logOut(@ActiveDevice() activeDevice: string) {
    return this.authService.logOut(activeDevice);
  }

  @UseGuards(IsLoggedIn)
  @Query(() => UserData)
  async getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
