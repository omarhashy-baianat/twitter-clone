import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalSerializer } from './common/interceptor/global-serilizer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new GlobalSerializer());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
