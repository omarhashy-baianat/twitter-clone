import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/entities/user.entity';
import { MediaModule } from './media/media.module';
import { Media } from './media/entities/media.entity';
import { AdminsModule } from './admins/admins.module';
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';
import { Post } from './posts/entities/post.entity';
import { Repost } from './reposts/entities/repost.entity';
import { Comment } from './comments/entities/comment.entity';
import { RepostsModule } from './reposts/reposts.module';
import { Like } from './likes/entities/likes.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { Bookmark } from './bookmarks/entities/bookmark.entity';
import { Otp } from './auth/entities/otp.entity';
import { Follow } from './follows/entity/follow.entity';
import { APP_PIPE } from '@nestjs/core';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { DateScalar } from './common/scalars/date.scalar';
import { QueueModule } from './queue/queue.module';
import { count } from 'console';
import { FileHandler } from './middlewares/file-handler.middleware';
import { DataloaderModule } from './dataloader/dataloader.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActiveDevices } from './notifications/entities/active-devices.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      path: '/graphql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          entities: [
            User,
            Media,
            Post,
            Repost,
            Comment,
            Like,
            Bookmark,
            Otp,
            Follow,
            ActiveDevices,
          ],
          database: config.get<string>('POSTGRES_DB'),
          synchronize: true,
          // dropSchema: true,
          // logging: ['query'],
        };
      },
    }),
    UsersModule,
    AuthModule,
    LikesModule,
    CommentsModule,
    MediaModule,
    AdminsModule,
    PostsModule,
    FollowsModule,
    RepostsModule,
    BookmarksModule,
    JwtTokenModule,
    QueueModule,
    DataloaderModule,
    SearchModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    DateScalar,
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileHandler).forRoutes('/graphql');
  }
}
