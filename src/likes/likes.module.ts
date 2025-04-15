import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { PostsModule } from 'src/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/likes.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [LikesResolver, LikesService],
  imports: [PostsModule, TypeOrmModule.forFeature([Like]), NotificationsModule],
})
export class LikesModule {}
