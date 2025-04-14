import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repost } from './entities/repost.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { PostsService } from 'src/posts/posts.service';
import { CreateRepostDto } from './dtos/create-repost.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class RepostsService {
  constructor(
    @InjectRepository(Repost) private repostRepository: Repository<Repost>,
    private mediaService: MediaService,
    private postsService: PostsService,
  ) {}

  async createRepost(createRepostDto: CreateRepostDto, user: User) {
    const mediaArray = await this.mediaService.getManyByIds(
      createRepostDto.mediaIds,
      ['user'],
    );

    const post = (await this.postsService.getPostById(createRepostDto.postId, [
      'user',
      'media'
    ])) as Post;

    mediaArray.forEach((media) => {
      if (media.user.id != user.id)
        throw new UnauthorizedException('unauthorized request');
    });

    const repost = this.repostRepository.create({
      media: mediaArray,
      content: createRepostDto.content,
      user,
      post,
    });
    
    return this.repostRepository.save(repost);
  }
}
