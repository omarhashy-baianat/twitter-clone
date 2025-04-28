import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsResolver } from './follows.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entity/follow.entity';

@Module({
  providers: [FollowsResolver, FollowsService],
  imports: [TypeOrmModule.forFeature([Follow])],
  exports: [FollowsService],
})
export class FollowsModule {}
