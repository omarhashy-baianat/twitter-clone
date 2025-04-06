import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    UsersModule,
    TweetsModule,
    AuthModule,

  ],
  providers: [AppService],
})
export class AppModule {}
