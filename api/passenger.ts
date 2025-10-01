import { NestFactory } from '@nestjs/core';
// Update the path below to the correct location of app.module.ts
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    
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

    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    
    // Set the correct path for NestJS routing
    req.url = req.url.replace(/^\/api\/passenger/, '/passenger');
    
    return instance(req, res);
  } catch (error) {
    console.error('Passenger API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}