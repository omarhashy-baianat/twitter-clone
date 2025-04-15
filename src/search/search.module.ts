import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { CommentsModule } from 'src/comments/comments.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  providers: [SearchResolver, SearchService],
  imports: [CommentsModule , PostsModule]
})
export class SearchModule {}
