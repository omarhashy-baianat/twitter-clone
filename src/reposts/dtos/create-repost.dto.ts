import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
} from 'class-validator';
import { MediaTarget } from 'src/enums/media-target.enum';
import { FileIdValidator } from 'src/validators/file-id.validator';
import { PostIdValidator } from 'src/validators/post-id.validator';

@InputType()
export class CreateRepostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Field()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('all')
  @Validate(PostIdValidator)
  @Field()
  postId: string;

  @IsOptional()
  @ArrayMaxSize(4)
  @IsUUID('all', { each: true })
  @Validate(FileIdValidator, [null, MediaTarget.REPOST], {
    each: true,
    message: 'Invalid file ID or file does not match media type/target',
  })
  @Field(() => [String], { nullable: true })
  mediaIds: string[];
}
