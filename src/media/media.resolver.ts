import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { uploadFileDto } from './dtos/upload-file.dto';
import { MessageData } from 'src/common/graphql/objects/message.object';
import { GetFile } from 'src/decorators/get-file.decorator';
import { MediaData } from './entities/media.entity';
import { Transactional } from 'typeorm-transactional';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-loged-in.guard';

@Resolver()
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => MediaData)
  @Transactional()
  @UseGuards(IsLoggedIn)
  UploadFile(
    @Args('fileData') uploadFileDto: uploadFileDto,
    @GetFile() file: Express.Multer.File,
    @Context('req') req: Request,
  ) {
    return this.mediaService.uploadFile(uploadFileDto, file, req);
  }
}
