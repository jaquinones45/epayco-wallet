import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { CORS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prefix = configService.get('PREFIX');
  const port = configService.get('PORT');

  app.enableCors(CORS);
  app.setGlobalPrefix(prefix);

  await app.listen(port, async () => {
    console.log(`Server is running on ${await app.getUrl()}`);
  });
}
bootstrap();
