import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  fastifyAdapter.enableCors({ origin: '*' });

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Invoicely API')
    .setDescription('The Invoicely API description')
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

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
