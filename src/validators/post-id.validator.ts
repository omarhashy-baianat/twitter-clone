import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as isUUID } from 'uuid';
import { PostsService } from 'src/posts/posts.service';

@ValidatorConstraint({ name: 'postId', async: true })
@Injectable()
export class PostIdValidator implements ValidatorConstraintInterface {
  constructor(private postsService: PostsService) {}
  async validate(value: any, validationArguments?: ValidationArguments) {
    if (!isUUID(value)) return false;
    const post = await this.postsService.findPostById(value);
    return !!post;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'invalid postId';
  }
}
