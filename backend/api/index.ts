import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:8000',
      'https://localhost:8000',
      process.env.FRONTEND_URL || 'http://localhost:8000',
      /\.vercel\.app$/,  // Allow all Vercel domains
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// For Vercel serverless deployment
let cachedApp: INestApplication;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: [
        'http://localhost:8000',
        'https://localhost:8000',
        process.env.FRONTEND_URL || 'http://localhost:8000',
        /\.vercel\.app$/,
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));

    app.setGlobalPrefix('api');
    
    await app.init();
    cachedApp = app;
  }

  return cachedApp.getHttpAdapter().getInstance()(req, res);
};

// For local development
if (require.main === module) {
  bootstrap();
}