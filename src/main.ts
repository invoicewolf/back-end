import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const config = new DocumentBuilder()
    .setTitle('InvoiceWolf API')
    .setDescription('The InvoiceWolf API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('companies')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'jwt' },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.enableCors();

  await app.init();

  http.createServer(server).listen(80);

  if (process.env.PRIVATE_KEY_PATH && process.env.CERTIFICATE_PATH) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert: fs.readFileSync(process.env.CERTIFICATE_PATH),
    };

    https.createServer(httpsOptions, server).listen(443);
  }
}

bootstrap();
