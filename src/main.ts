import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SnakeCaseInterceptor } from './utils/SnakeCaseInceptor';
// import { SnakeCaseInterceptor } from './utils/SnakeCaseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Ambil BASE_URL dan PORT dari environment
  const baseUrl = configService.get<string>(
    'BASE_URL',
    'http://localhost:3000',
  );
  const port = configService.get<number>('PORT', 3000);

  // Atur global prefix untuk API
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  // Register interceptor sebelum app.listen
  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  // Jalankan aplikasi
  await app.listen(port);

  console.log(`Application is running on: ${baseUrl}:${port}`);
}
bootstrap();
