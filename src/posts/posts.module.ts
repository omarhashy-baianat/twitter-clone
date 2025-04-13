import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MediaModule } from 'src/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  providers: [PostsResolver, PostsService],
  imports: [TypeOrmModule.forFeature([Post]), MediaModule],
  exports: [PostsService]
})
export class PostsModule {}
