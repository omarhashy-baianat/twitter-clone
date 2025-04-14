import { Module } from '@nestjs/common';
import { RepostsService } from './reposts.service';
import { RepostsResolver } from './reposts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repost } from './entities/repost.entity';
import { MediaModule } from 'src/media/media.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  providers: [RepostsResolver, RepostsService],
  imports: [TypeOrmModule.forFeature([Repost]), MediaModule, PostsModule],
})
export class RepostsModule {}
