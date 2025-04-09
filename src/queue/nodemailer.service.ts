import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { privateDecrypt } from 'crypto';
import * as Nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodemailerService {
  private transporter: Nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(private configService: ConfigService) {
    this.transporter = Nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow('GOOGLE_EMAIL'),
        pass: this.configService.getOrThrow('GOOGLE_APP_PASSWORD'),
      },
    });
  }

  async sendEmail(msg) {
    console.log('hi')
    msg.from = this.configService.getOrThrow('GOOGLE_EMAIL');
    const enf = this.transporter.sendMail(msg);
    console.log(enf)
  }
}
