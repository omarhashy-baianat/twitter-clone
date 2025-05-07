import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
} from 'class-validator';
import { MediaTarget } from 'src/enums/media-target.enum';
import { FileIdValidator } from 'src/validators/file-id.validator';

@InputType()
export class UpdatePostMediaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Field()
  postId: string;

  @IsOptional()
  @IsUUID()
  @Validate(FileIdValidator, [null, MediaTarget.POST], {
    message: 'Invalid file ID or file does not match media type/target',
  })
  @Field(() => String)
  mediaId: string;
}
