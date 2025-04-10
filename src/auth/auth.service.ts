import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/enums/user-roles.enum';
import { RegisterWithEmailDto } from './Dtos/register-with-email.dto';
import { AuthType } from 'src/enums/auth-type.emum';
import { OtpService } from './otp.servise';
import { OtpType } from 'src/enums/otp-type.enum';
import { QueueService } from 'src/queue/queue.service';
import { VerifyUserEmailDto } from './Dtos/verify-user-email.dto';
import * as moment from 'moment';
import { ResetUserPasswordDto } from './Dtos/reset-user-password.dto';
import { VerifyResetPasswordDto } from './Dtos/verify-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginWithEmailDto } from './Dtos/login-with-email.dto';
import { GoogleAuthService } from './google-auth.service';
import { RegisterWithGoogleDto } from './Dtos/register-with-google.dto';
import { LoginWithGoogleDto } from './Dtos/login-with-google.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private otpService: OtpService,
    private queueService: QueueService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
  ) {}

  async seedSuperAdmin() {
    const email = this.configService.getOrThrow('SUPER_ADMIN_EMAIL');
    const username = this.configService.getOrThrow('SUPER_ADMIN_USERNAME');
    const password = this.configService.getOrThrow('SUPER_ADMIN_PASSWORD');
    const firstName = this.configService.getOrThrow('SUPER_ADMIN_FIRST_NAME');
    const lastName = this.configService.getOrThrow('SUPER_ADMIN_LAST_NAME');
    const dateOfBirth = this.configService.getOrThrow(
      'SUPER_ADMIN_DATE_OF_BIRTH',
    );

    if (await this.usersService.findOneByEmail(email))
      throw new BadRequestException('superAdmin already exists');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.createUserWithEmail(
      email,
      username,
      hashedPassword,
      firstName,
      lastName,
      new Date(parseInt(dateOfBirth)),
      AuthType.EMAIL,
      true,
      UserRole.SUPER_ADMIN,
    );

    return user;
  }

  async registerUserByEmail(registerUserByEmailDto: RegisterWithEmailDto) {
    const hashedPassword = await bcrypt.hash(
      registerUserByEmailDto.password,
      10,
    );

    const user = await this.usersService.createUserWithEmail(
      registerUserByEmailDto.email,
      registerUserByEmailDto.username,
      hashedPassword,
      registerUserByEmailDto.firstName,
      registerUserByEmailDto.lastName,
      registerUserByEmailDto.dateOfBirth,
    );

    const otp = await this.otpService.generateOtp(user, OtpType.VERIFY_EMAIL);
    this.queueService.sendVerificationEmail(otp.otp, user.email);
    return user;
  }

  async registerUserWithGoogle(registerUserByGoogleDto: RegisterWithGoogleDto) {
    const tokenData = await this.googleAuthService.validateGoogleToken(
      registerUserByGoogleDto.token,
    );

    if (await this.usersService.findOneByEmail(tokenData.email))
      throw new BadRequestException('User already exist');

    const user = await this.usersService.createUserWithEmail(
      tokenData.email,
      registerUserByGoogleDto.username,
      undefined,
      tokenData.given_name,
      tokenData.family_name,
      registerUserByGoogleDto.dateOfBirth,
      AuthType.GOOGLE,
      true,
    );

    return user;
  }

  async verifyUserEmail(verifyUserEmailDto: VerifyUserEmailDto) {
    const user = await this.usersService.findOneByEmail(
      verifyUserEmailDto.email,
      ['otp'],
    );

    if (!user || !user.otp || user.verified)
      throw new BadRequestException('invalid request');

    if (user.otp.otp != verifyUserEmailDto.otp)
      throw new UnauthorizedException('invalid OTP');

    const fiveMinAgo = moment().subtract(5, 'minute').toDate();

    if (fiveMinAgo.getTime() > user.otp.createdAt.getTime())
      throw new BadRequestException('expired OTP');
    this.otpService.removeOtp(user.otp);
    return this.usersService.updateUser(user, { verified: true });
  }

  async resetUserPassword(resetUserPasswordDto: ResetUserPasswordDto) {
    const user = await this.usersService.findOneByEmail(
      resetUserPasswordDto.email,
    );
    if (!user || !user.verified || user.auth == AuthType.GOOGLE)
      throw new BadRequestException('invalid request');

    const existingOtp = await this.otpService.findOtp(
      {
        user: { id: user.id },
      },
      ['user'],
    );

    if (existingOtp) {
      const twoMinAgo = moment().subtract(2, 'minute').toDate();
      if (twoMinAgo.getTime() < existingOtp.createdAt.getTime())
        throw new BadRequestException(
          'OTP can not be resent before two minutes',
        );
      await this.otpService.removeOtp(existingOtp);
    }
    const otp = await this.otpService.generateOtp(user, OtpType.RESET_PASSWORD);
    this.queueService.sendResetPasswordEmail(otp.otp, user.email);
    return { message: 'OTP set successfully' };
  }

  async verifyResetUserPassword(
    verifyResetPasswordDto: VerifyResetPasswordDto,
  ) {
    const user = await this.usersService.findOneByEmail(
      verifyResetPasswordDto.email,
      ['otp'],
    );

    if (!user || !user.otp || !user.verified)
      throw new BadRequestException('invalid request');

    if (user.otp.otp != verifyResetPasswordDto.otp)
      throw new UnauthorizedException('expired OTP');

    const fiveMinAgo = moment().subtract(5, 'minute').toDate();

    if (fiveMinAgo.getTime() > user.otp.createdAt.getTime())
      throw new BadRequestException('expired OTP');

    const hashedPassword = await bcrypt.hash(
      verifyResetPasswordDto.password,
      10,
    );

    this.otpService.removeOtp(user.otp);
    return this.usersService.updateUser(user, {
      password: hashedPassword,
    });
  }

  async loginWithEmail(loginUserDto: LoginWithEmailDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    if (!user) throw new UnauthorizedException('wrong email or password');
    if (!user.verified || user.auth != AuthType.EMAIL)
      throw new UnauthorizedException('unauthorized access');

    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatch)
      throw new UnauthorizedException('wrong email or password');

    return {
      token: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }

  async loginWithGoogle(loginWithGoogleDto: LoginWithGoogleDto) {
    const tokenData = await this.googleAuthService.validateGoogleToken(
      loginWithGoogleDto.token,
    );

    const user = await this.usersService.findOneByEmail(tokenData.email);

    if (!user) throw new UnauthorizedException('user does not exist');
    if (user.auth != AuthType.GOOGLE)
      throw new UnauthorizedException('unauthorized access');

    return {
      toke: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }
}
