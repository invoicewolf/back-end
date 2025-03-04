import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = process.env.API_HTTP_PORT;

  await app.listen(port, '0.0.0.0');
}

bootstrap();
