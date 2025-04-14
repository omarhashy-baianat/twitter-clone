import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/entities/post.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private mediaService: MediaService,
    private postsService: PostsService,
  ) {}
  async createComment(createCommentDto: CreateCommentDto, user: User) {
    const mediaArray = await this.mediaService.getManyByIds(
      createCommentDto.mediaIds,
      ['user'],
    );

    const post = (await this.postsService.getPostById(createCommentDto.postId, [
      'user',
      'media',
    ])) as Post;

    mediaArray.forEach((media) => {
      if (media.user.id != user.id)
        throw new UnauthorizedException('unauthorized request');
    });
    await this.postsService.addComment(post);
    const comment = this.commentRepository.create({
      media: mediaArray,
      content: createCommentDto.content,
      user,
      post,
    });
    return this.commentRepository.save(comment);
  }

  async updateComment(updateCommentDto: UpdateCommentDto, user: User) {
    const comment = await this.findCommentById(updateCommentDto.id, [
      'user',
      'media',
      'post',
      'post.user',
      'post.media',
    ]);
    if (!comment) throw new BadRequestException('comment does not exist');
    if (comment.user.id != user.id)
      throw new UnauthorizedException('unauthorized access');
    const partialComment: Partial<Comment> = {};

    if (updateCommentDto?.mediaIds) {
      const mediaArray = await this.mediaService.getManyByIds(
        updateCommentDto.mediaIds,
        ['user'],
      );
      mediaArray.forEach((media) => {
        if (media.user.id != user.id)
          throw new UnauthorizedException('unauthorized request');
      });
      partialComment.media = mediaArray;
    }

    partialComment.content = updateCommentDto.content;
    const updatedComment = this.commentRepository.merge(
      comment,
      partialComment,
    );
    return this.commentRepository.save(updatedComment);
  }

  async deleteComment(id: string, user: User) {
    if (!isUUID(id)) throw new BadRequestException('ID should be a valid uuid');
    const comment = await this.findCommentById(id, ['user', 'post']);
    if (!comment) throw new NotFoundException();
    if (comment.user.id != user.id) throw new UnauthorizedException();
    await this.postsService.removeComment(comment.post);
    await this.removeByComment(comment);
    return { message: 'comment removed successfully' };
  }

  async getComment(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Id should be a valid uuid');
    return this.findCommentById(id, [
      'user',
      'media',
      'post',
      'post.user',
      'post.media',
    ]);
  }

  findCommentById(id: string, relations: string[] = []) {
    return this.commentRepository.findOne({ where: { id }, relations });
  }

  removeByComment(comment: Comment) {
    return this.commentRepository.remove(comment);
  }
}
