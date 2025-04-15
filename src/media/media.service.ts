import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { In, Repository } from 'typeorm';
import { uploadFileDto } from './dtos/upload-file.dto';
import { MediaTarget } from 'src/enums/media-target.enum';
import { MediaType } from 'src/enums/media-type.enum';
import { removeFile } from 'src/common/utils/remove-file.util';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  uploadFile(
    uploadFileDto: uploadFileDto,
    file: Express.Multer.File,
    req: any,
    user: User,
  ) {
    if (req.fileError) throw new BadRequestException('invalid file');

    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];

    let mediaType: MediaType;

    if (allowedVideoTypes.includes(file.mimetype)) mediaType = MediaType.VIDEO;
    else mediaType = MediaType.IMAGE;

    if (
      (uploadFileDto.target == MediaTarget.PROFILE_COVER ||
        uploadFileDto.target == MediaTarget.PROFILE_PICTURE) &&
      mediaType != MediaType.IMAGE
    ) {
      removeFile(file.filename);
      throw new BadRequestException('invalid file type');
    }
    const media = this.mediaRepository.create({
      fileName: file.filename,
      type: mediaType,
      target: uploadFileDto.target,
      user,
    });

    return this.mediaRepository.save(media);
  }

  getMediaById(id: string, relations: string[] = []) {
    return this.mediaRepository.findOne({
      where: { id },
      relations,
    });
  }

  getManyByIds(ids: string[], relations: string[] = []) {
    return this.mediaRepository.find({
      where: { id: In(ids) },
      relations,
    });
  }

  getManyMediaByCommentIds(commentIds: string[]) {
    
  }
}
