import { Global, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { MediaModule } from 'src/media/media.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  providers: [CommentsResolver, CommentsService],
  imports: [
    TypeOrmModule.forFeature([Comment]),
    MediaModule,
    PostsModule,
    CommentsModule,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
