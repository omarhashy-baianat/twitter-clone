import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerService } from './nodemailer.service';
import { EmailProcessor } from './email.worker.ts/email.worker';

@Module({
  providers: [QueueService, NodemailerService, EmailProcessor],
  exports:[QueueService],
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 3000,
          backoff: 3000,
        },
      }),
    }),
    BullModule.registerQueue({name: 'email'})
  ],
})
export class QueueModule {}
