import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { uploadFileDto } from './dtos/upload-file.dto';
import { MediaTarget } from 'src/enums/media-target.enum';
import { MediaType } from 'src/enums/media-type.enum';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  uploadFile(
    uploadFileDto: uploadFileDto,
    file: Express.Multer.File,
    req: any,
  ) {
    if (req.fileError) throw new BadRequestException('invalid file');

    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    let mediaType: MediaType;

    if (allowedVideoTypes.includes(file.mimetype)) mediaType = MediaType.VIDEO;
    else mediaType = MediaType.IMAGE;

    if (
      (uploadFileDto.target == MediaTarget.PROFILE_COVER ||
        uploadFileDto.target == MediaTarget.PROFILE_PICTURE) &&
      mediaType != MediaType.IMAGE
    )
      throw new BadRequestException('invalid file type');

    const media = this.mediaRepository.create({
      fileName: file.filename,
      type: mediaType,
      target: uploadFileDto.target,
    });

    return this.mediaRepository.save(media);
  }
}
