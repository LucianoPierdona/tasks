import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'verbose', 'warn'],
  });

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Presentation API')
    .setDescription('The presentation API description')
    .setVersion('1.0')
    .addTag('presentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
