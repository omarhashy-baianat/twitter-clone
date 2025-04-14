import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private BookmarkRepository: Repository<Bookmark>,
    private postsService: PostsService,
  ) {}

  async getBookmark(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('post does not exist');

    return this.getBookmarkByPostAndUser(post, user, [
      'post.user',
      'post.media',
    ]);
  }

  async createBookmark(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId, ['media', 'user']);
    if (!post) throw new NotFoundException('post does not exist');

    const existedBookmark = await this.getBookmarkByPostAndUser(post, user);

    if (existedBookmark)
      throw new BadRequestException('Bookmark already exist');

    await this.postsService.addBookmark(post);
    const Bookmark = this.BookmarkRepository.create({
      post,
      user,
    });
    return this.BookmarkRepository.save(Bookmark);
  }

  async deleteBookmark(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('post does not exist');

    const Bookmark = await this.getBookmarkByPostAndUser(post, user);
    if (!Bookmark) throw new BadRequestException('Bookmark does not exist');

    await this.postsService.removeBookmark(post);
    await this.BookmarkRepository.remove(Bookmark);

    return {
      message: 'Bookmark removed successfully',
    };
  }

  getBookmarkByPostAndUser(post: Post, user: User, relations: string[] = []) {
    return this.BookmarkRepository.findOne({
      where: {
        post: { id: post.id },
        user: { id: user.id },
      },
      relations: [...new Set([...['post', 'user'], ...relations])],
    });
  }
}
