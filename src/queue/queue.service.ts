import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  sendEmailVerificationEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'twitter clone email verification',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    console.log("hkh [dj")
    this.emailQueue.add('verify use email', email);
  }
}
