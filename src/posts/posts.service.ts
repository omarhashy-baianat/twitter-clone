import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dtos/create-post.dto';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private mediaService: MediaService,
  ) {}

  async createPost(createPostDto: createPostDto, user: User) {
    const mediaArray = await this.mediaService.getManyByIds(
      createPostDto.mediaIds,
      ['user'],
    );
    mediaArray.forEach((media) => {
      if (media.user.id != user.id)
        throw new UnauthorizedException('unauthorized request');
    });
    const post = this.postRepository.create({
      media: mediaArray,
      content: createPostDto.content,
      user
    });
    return this.postRepository.save(post);
  }
}
