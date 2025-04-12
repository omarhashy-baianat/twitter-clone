import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { uploadFileDto } from './dtos/upload-file.dto';
import { MessageData } from 'src/common/graphql/objects/message.object';
import { GetFile } from 'src/decorators/get-file.decorator';

@Resolver()
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => MessageData)
  UploadFile(
    @Args('fileData') uploadFileDto: uploadFileDto,
    @GetFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      message: 'file uploaded',
    };
  }
}
