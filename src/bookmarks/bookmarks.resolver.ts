import { Resolver } from '@nestjs/graphql';
import { BookmarksService } from './bookmarks.service';

@Resolver()
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}
}
