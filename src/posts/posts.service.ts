import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private mediaService: MediaService,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
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
      user,
    });
    return this.postRepository.save(post);
  }

  async updatePost(updatePostDto: UpdatePostDto, user: User) {
    const post = await this.findPostById(updatePostDto.id, ['user', 'media']);
    if (!post) throw new BadRequestException('post does not exist');
    if (post.user.id != user.id)
      throw new UnauthorizedException('unauthorized access');
    const partialPost: Partial<Post> = {};

    if (updatePostDto?.mediaIds?.length) {
      const mediaArray = await this.mediaService.getManyByIds(
        updatePostDto.mediaIds,
        ['user'],
      );
      mediaArray.forEach((media) => {
        if (media.user.id != user.id)
          throw new UnauthorizedException('unauthorized request');
      });
      partialPost.media = mediaArray;
    }

    partialPost.content = updatePostDto.content;
    const updatedPost = this.postRepository.merge(post, partialPost);
    return this.postRepository.save(updatedPost);
  }

  async deletePost(id: string, user: User) {
    const post = await this.findPostById(id, ['user']);
    if (!post) throw new NotFoundException();
    if (post.user.id != user.id) throw new UnauthorizedException();
    await this.removePostByPost(post);
    return { message: 'post removed successfully' };
  }

  findPostById(id: string, relations: string[] = []) {
    return this.postRepository.findOne({
      where: { id },
      relations,
    });
  }

  removePostByPost(post: Post) {
    return this.postRepository.remove(post);
  }
}
