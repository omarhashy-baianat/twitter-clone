import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalSerializer } from './common/interceptor/global-serilizer.interceptor';
import { GraphQLExceptionFilter } from './common/error/error.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new GlobalSerializer());
  app.useGlobalFilters(new GraphQLExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
