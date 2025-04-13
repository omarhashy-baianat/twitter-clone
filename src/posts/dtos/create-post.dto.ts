import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
} from 'class-validator';
import { MediaTarget } from 'src/enums/media-target.enum';
import { FileIdValidator } from 'src/validators/file-id.validator';

@InputType()
export class createPostDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  content: string;

  @ArrayMaxSize(4)
  @IsUUID('4', { each: true })
  @Validate(FileIdValidator, [null, MediaTarget.POST], {
      each: true,
      message: 'Invalid file ID or file does not match media type/target',
    })
  @Field(() => [String], { nullable: true })
  mediaIds: string[];
}
