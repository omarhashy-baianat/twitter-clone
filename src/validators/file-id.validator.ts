import { Injectable } from '@nestjs/common';
import { constants } from 'buffer';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MediaTarget } from 'src/enums/media-target.enum';
import { MediaType } from 'src/enums/media-type.enum';
import { MediaService } from 'src/media/media.service';

@ValidatorConstraint({ name: 'fileId', async: true })
@Injectable()
export class FileIdValidator implements ValidatorConstraintInterface {
  constructor(private mediaService: MediaService) {}
  async validate(value: string, validationArguments?: ValidationArguments) {
    if (!validationArguments?.constraints.length)
      throw new Error('validation arguments can not be null');
    const [mediaType, mediaTarget] = validationArguments.constraints as [
      MediaType,
      MediaTarget,
    ];

    const media = await this.mediaService.getMediaById(value, ['user']);

    if (!media) return false;
    if (media.type != mediaType) return false;
    if (media.target != mediaTarget) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `invalid file`;
  }
}
