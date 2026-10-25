import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { envs } from './config/envs.js';
import { Logger } from '@nestjs/common';

async function bootstrap() { 

  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`)
}
await bootstrap();
