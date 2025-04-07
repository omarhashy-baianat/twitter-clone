import { Module } from '@nestjs/common';
import { RepostsService } from './reposts.service';
import { RepostsResolver } from './reposts.resolver';

@Module({
  providers: [RepostsResolver, RepostsService],
})
export class RepostsModule {}
