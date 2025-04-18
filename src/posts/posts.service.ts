import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like, Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { validate as isUUID } from 'uuid';

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

    if (updatePostDto?.mediaIds) {
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

  async getPost(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id should be a valid uuid');
    return this.getPostById(id, ['media', 'user']);
  }

  async deletePost(id: string, user: User) {
    if (!isUUID(id)) throw new BadRequestException('id should be a valid uuid');
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

  getPostById(id: string, relations: string[] = []) {
    return this.postRepository.findOne({
      where: { id },
      relations,
    });
  }

  addComment(post: Post) {
    post.commentsCounter++;
    return this.postRepository.save(post);
  }

  removeComment(post: Post) {
    post.commentsCounter--;
    return this.postRepository.save(post);
  }

  async searchPosts(keyWord: string, page: number) {
    const take = 2;
    const skip = (page - 1) * take;
    return this.postRepository.findAndCount({
      where: {
        content: Like(`%${keyWord}%`),
      },
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user' , 'media'],
    });
  }

  addLike(post: Post) {
    post.likesCounter++;
    return this.postRepository.save(post);
  }

  removeLike(post: Post) {
    post.likesCounter--;
    return this.postRepository.save(post);
  }

  addBookmark(post: Post) {
    post.bookmarksCounter++;
    return this.postRepository.save(post);
  }

  removeBookmark(post: Post) {
    post.bookmarksCounter--;
    return this.postRepository.save(post);
  }

  addRepost(post: Post) {
    post.repostsCounter++;
    return this.postRepository.save(post);
  }

  removeRepost(post: Post) {
    post.repostsCounter--;
    return this.postRepository.save(post);
  }
}
