import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { IsLoggedIn } from './guards/is-loged-in.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

@Controller()
export class AppController {
  @UseGuards(IsLoggedIn)
  @Get('uploads/:file')
  async getUpload(@Param('file') fileName: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', fileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException();
    }
    const file = createReadStream(filePath);

    return file.pipe(res);
  }

}
