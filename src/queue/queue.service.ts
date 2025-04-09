import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  sendVerificationEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'twitter-clone email verification',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('verify user email', email);
  }

  sendResetPasswordEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'twitter-clone reset password',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('reset password email', email);
  }
}
