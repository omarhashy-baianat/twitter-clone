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

@InputType()
export class UpdateRepostDto {
  @IsString()
  @IsUUID('4')
  @Field()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Field()
  content: string;

  // @IsOptional()
  // @ArrayMaxSize(4)
  // @IsUUID('all', { each: true })
  // @Validate(FileIdValidator, [null, MediaTarget.COMMENT], {
  //   each: true,
  //   message: 'Invalid file ID or file does not match media type/target',
  // })
  // @Field(() => [String], { nullable: true })
  // mediaIds: string[];
}
