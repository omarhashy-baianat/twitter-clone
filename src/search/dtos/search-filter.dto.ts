import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class SearchFilterDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  keyWord: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field({ defaultValue: 1 })
  page: number;

  @IsBoolean()
  @Field(() => Boolean, { defaultValue: true })
  includePosts: boolean;

  @IsBoolean()
  @Field(() => Boolean, { defaultValue: true })
  includeComments: boolean;

  @IsBoolean()
  @Field(() => Boolean, { defaultValue: true })
  includeUsers: User;
}
