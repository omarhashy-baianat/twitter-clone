import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { PostsModule } from 'src/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/likes.entity';

@Module({
  providers: [LikesResolver, LikesService],
  imports: [PostsModule, TypeOrmModule.forFeature([Like])],
})
export class LikesModule {}
