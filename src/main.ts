import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalSerializer } from './common/interceptor/global-serilizer.interceptor';
import { GraphQLExceptionFilter } from './common/error/error.filter';
import { useContainer } from 'class-validator';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get<DataSource>(getDataSourceToken());

  addTransactionalDataSource(dataSource);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new GlobalSerializer());
  app.useGlobalFilters(new GraphQLExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
