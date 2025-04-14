import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/likes.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    private postsService: PostsService,
  ) {}

  async getLike(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('post does not exist');

    return this.getLikeByPostAndUser(post, user, ['post.user', 'post.media']);
  }

  async createLike(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId, ['media', 'user']);
    if (!post) throw new NotFoundException('post does not exist');

    const existedLike = await this.getLikeByPostAndUser(post, user);

    if (existedLike) throw new BadRequestException('like already exist');

    await this.postsService.addLike(post);

    const like = this.likeRepository.create({
      post,
      user,
    });
    return this.likeRepository.save(like);
  }

  async deleteLike(postId: string, user: User) {
    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('post does not exist');

    const like = await this.getLikeByPostAndUser(post, user);
    if (!like) throw new BadRequestException('like does not exist');

    this.postsService.removeLike(post);
    await this.likeRepository.remove(like);

    return {
      message: 'like removed successfully',
    };
  }

  getLikeByPostAndUser(post: Post, user: User, relations: string[] = []) {
    return this.likeRepository.findOne({
      where: {
        post: { id: post.id },
        user: { id: user.id },
      },
      relations: [...new Set([...['post', 'user'], ...relations])],
    });
  }
}
