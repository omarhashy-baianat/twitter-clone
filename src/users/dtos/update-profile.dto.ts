import { FileValidator } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { MediaTarget } from 'src/enums/media-target.enum';
import { MediaType } from 'src/enums/media-type.enum';

@InputType()
export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Field({ nullable: true })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Field({ nullable: true })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @Field({ nullable: true })
  bio: string;

  @IsString()
  @Validate(FileValidator, [MediaType.IMAGE, MediaTarget.PROFILE_PICTURE])
  @IsOptional()
  @Field({ nullable: true })
  profilePictureId: string;

  @IsString()
  @Validate(FileValidator, [MediaType.IMAGE, MediaTarget.PROFILE_COVER])
  @IsOptional()
  @Field({ nullable: true })
  coverPictureId: string;
}
