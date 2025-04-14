import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksResolver } from './bookmarks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/follows/entity/follow.entity';
import { PostsModule } from 'src/posts/posts.module';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  providers: [BookmarksResolver, BookmarksService],
  imports: [PostsModule, TypeOrmModule.forFeature([Bookmark])],
})
export class BookmarksModule {}
