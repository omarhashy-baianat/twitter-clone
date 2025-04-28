import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Like, Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { validate as isUUID } from 'uuid';
import { FollowsService } from 'src/follows/follows.service';
import { paginationSerializer } from 'src/common/utils/pagination-serializer.util';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private mediaService: MediaService,
    private followsService: FollowsService,
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

    partialPost.content = updatePostDto.content;
    const updatedPost = this.postRepository.merge(post, partialPost);
    return this.postRepository.save(updatedPost);
  }

  async getPost(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id should be a valid uuid');
    const post = await this.getPostById(id, ['media', 'user']);
    console.log(post?.userId);
    return post;
  }

  async getFollowingPosts(user: User, page: number = 1) {
    if (page < 1) {
      throw new BadRequestException('page can not be less than one!');
    }
    const followingsIds = await this.followsService.getUserFollowingIds(user);

    const take = 3;
    const skip = take * (page - 1);
    const [posts, postsCount] = await this.postRepository.findAndCount({
      skip,
      take,
      where: {
        user: {
          id: In(followingsIds),
        },
      },
      relations: ['media'],
      order: {
        createdAt: 'DESC',
      },
    });
    return paginationSerializer<Post>(page, take, postsCount, posts);
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
      relations: ['user', 'media'],
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
