import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CommentsModule } from 'src/comments/comments.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  providers: [DataloaderService],
  imports: [CommentsModule],
})
export class DataloaderModule {}
