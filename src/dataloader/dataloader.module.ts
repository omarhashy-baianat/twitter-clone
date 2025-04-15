import { Global, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CommentsModule } from 'src/comments/comments.module';

@Global()
@Module({
  providers: [DataloaderService],
  imports: [CommentsModule],
  exports:[DataloaderService]
})
export class DataloaderModule {}
