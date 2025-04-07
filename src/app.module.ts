import { Module } from '@nestjs/common';
import { AppService } from './app.service';
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
import { Repost } from './posts/entities/repost.entity';
import { Comment } from './comments/entities/comment.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    })
    ,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    TypeOrmModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>  {
          return {
            type: 'postgres',
            host: config.get('POSTGRES_HOST'),
            port: config.get('POSTGRES_PORT'),
            username: config.get('POSTGRES_USER'),
            password: config.get('POSTGRES_PASSWORD'),
            entities: [User , Media, Post, Repost, Comment],
            database: config.get<string>("POSTGRES_DB"),
            synchronize : true,
            // dropSchema: true
          }
        }
      }
    ),
    UsersModule,
    AuthModule,
    LikesModule,
    CommentsModule,
    MediaModule,
    AdminsModule,
    PostsModule,
    FollowsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
