import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/entities/post.entity';

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


    const post = await this.postsService.getPostById(createCommentDto.postId) as Post;

    mediaArray.forEach((media) => {
      if (media.user.id != user.id)
        throw new UnauthorizedException('unauthorized request');
    });
    const comment = this.commentRepository.create({
      media: mediaArray,
      content: createCommentDto.content,
      user,
      post
    });
    return this.commentRepository.save(comment);
  }
}
