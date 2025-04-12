import { Field, InputType } from '@nestjs/graphql';
import { File } from 'src/common/scalars/file.scalar';
import { MediaTarget } from 'src/enums/media-target.enum';

@InputType()
export class uploadFileDto {
  @Field(() => MediaTarget)
  target: MediaTarget;

  @Field(() => File , {nullable : true})
  file: Express.Multer.File;
}
