import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Image Upload API')
    .setDescription('API for uploading images to Cloudinary')
    .setVersion('1.0')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at /api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5000);

}
bootstrap();
