import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repost } from './entities/repost.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { PostsService } from 'src/posts/posts.service';
import { CreateRepostDto } from './dtos/create-repost.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { validate as isUUID } from 'uuid';
import { UpdateRepostDto } from './dtos/update-repost.dto';
import { UserRole } from 'src/enums/user-roles.enum';

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
      'media',
    ])) as Post;

    mediaArray.forEach((media) => {
      if (media.user.id != user.id)
        throw new UnauthorizedException('unauthorized request');
    });

    this.postsService.addRepost(post);

    const repost = this.repostRepository.create({
      media: mediaArray,
      content: createRepostDto.content,
      user,
      post,
    });

    return this.repostRepository.save(repost);
  }

  async updateRepost(updateRepostDto: UpdateRepostDto, user: User) {
    const repost = await this.findRepostById(updateRepostDto.id, [
      'user',
      'media',
      'post',
      'post.user',
      'post.media',
    ]);
    if (!repost) throw new BadRequestException('repost does not exist');
    if (repost.user.id != user.id)
      throw new UnauthorizedException('unauthorized access');
    const partialRepost: Partial<Repost> = {};

    if (updateRepostDto?.mediaIds) {
      const mediaArray = await this.mediaService.getManyByIds(
        updateRepostDto.mediaIds,
        ['user'],
      );
      mediaArray.forEach((media) => {
        if (media.user.id != user.id)
          throw new UnauthorizedException('unauthorized request');
      });
      partialRepost.media = mediaArray;
    }
    partialRepost.content = updateRepostDto.content;
    const updatedRepost = this.repostRepository.merge(repost, partialRepost);
    return this.repostRepository.save(updatedRepost);
  }

  async deleteRepost(id: string, user: User) {
    if (!isUUID(id)) throw new BadRequestException('ID should be a valid uuid');
    const repost = await this.findRepostById(id, ['user','post']);
    if (!repost) throw new NotFoundException();
    if (repost.user.id != user.id) throw new UnauthorizedException();
    await this.postsService.removeRepost(repost.post)
    await this.removeByRepost(repost);
    return { message: 'repost removed successfully' };
  }

  async getRepost(id: string) {
    if (!isUUID(id)) throw new BadRequestException('ID should be a valid uuid');
    return this.findRepostById(id, [
      'user',
      'media',
      'post',
      'post.user',
      'post.media',
    ]);
  }

  findRepostById(id: string, relations: string[] = []) {
    return this.repostRepository.findOne({ where: { id }, relations });
  }

  removeByRepost(repost: Repost) {
    return this.repostRepository.remove(repost);
  }
}
