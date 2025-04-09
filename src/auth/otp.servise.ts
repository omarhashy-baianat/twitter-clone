import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as OtpGenerator from 'otp-generator';
import { OtpType } from 'src/enums/otp-type.enum';

@Injectable()
export class OtpService {
  constructor(@InjectRepository(Otp) private otpRepository: Repository<Otp>) {}

  async generateOtp(user: User, type: OtpType) {
    const otpString = OtpGenerator.generate(6);
    const otp = this.otpRepository.create({ otp: otpString, type, user });
    return this.otpRepository.save(otp);
  }

  findOtpBy(where: object, relations: string[] = []) {
    return this.otpRepository.findOne({ where, relations });
  }

  removeOtp(otp: Otp) {
    return this.otpRepository.remove(otp);
  }
}
