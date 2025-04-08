import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';

@Module({
  providers: [QueueResolver, QueueService],
})
export class QueueModule {}
