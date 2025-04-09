import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/enums/user-roles.enum';
import { RegisterWithEmailDto } from './Dtos/register-with-email.dto';
import { AuthType } from 'src/enums/auth-type.emum';
import { OtpService } from './otp.servise';
import { OtpType } from 'src/enums/otp-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private otpService: OtpService,
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
      UserRole.SUPER_ADMIN,
      true,
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

    const otp = await this.otpService.generateOtp(user,OtpType.VERIFY_EMAIL);
    
    return user;
  }
}
