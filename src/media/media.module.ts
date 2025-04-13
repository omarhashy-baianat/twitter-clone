import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaResolver } from './media.resolver';
import { FileScaler } from 'src/common/scalars/file.scalar';

@Module({
  providers: [MediaService, MediaResolver, FileScaler],
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [MediaService],
})
export class MediaModule {}
