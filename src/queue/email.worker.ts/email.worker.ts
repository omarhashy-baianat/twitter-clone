import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NodemailerService } from '../nodemailer.service';

@Processor('email', { limiter: { duration: 10000, max: 20 } })
export class EmailProcessor extends WorkerHost {
  constructor(private nodeMailerService: NodemailerService) {
    super();
  }
  async process(job: Job): Promise<any> {
    const data = job.data;
    await this.nodeMailerService.sendEmail(data);
  }
}