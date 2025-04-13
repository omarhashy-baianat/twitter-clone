import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MediaModule } from 'src/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostIdValidator } from 'src/validators/post-id.validator';

@Module({
  providers: [PostsResolver, PostsService, PostIdValidator],
  imports: [TypeOrmModule.forFeature([Post]), MediaModule],
  exports: [PostsService],
})
export class PostsModule {}
