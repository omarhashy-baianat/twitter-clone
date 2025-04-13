import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { MulterFileHandler } from 'src/common/config/multer.config';

@Injectable()
export class FileHandler implements NestMiddleware {
  use(req, res, next: NextFunction) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      next();
      return;
    }
    MulterFileHandler.single('0')(req, res, function (error) {
      req.fileError = error;
      req.body = JSON.parse(req.body.operations);
      next();
    });
  }
}
