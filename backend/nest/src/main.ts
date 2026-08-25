import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      cors: {
        credentials: true,
        origin: [configService.getFrontendUrl(), 'http://localhost:8080']
      },
    });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.getPort());
}
bootstrap();
