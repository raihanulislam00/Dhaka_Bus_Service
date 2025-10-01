import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Enable CORS for frontend communication
    app.enableCors({
      origin: [
        'http://localhost:8000',
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://dhaka-bus-service-oaw75q4uk-raihan-de930adc.vercel.app',
        'https://dhaka-bus-service-p7t6lws4c-raihan-de930adc.vercel.app',
        'https://dhaka-bus-service-7rj10lg9o-raihan-de930adc.vercel.app',
        /\.vercel\.app$/,
        /\.railway\.app$/,
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });
    app.useGlobalPipes(new ValidationPipe({
       whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    }));
    
    const port = process.env.PORT ?? 3000;
    console.log('🚀 Backend server starting on port', port);
    
    // Railway requires binding to 0.0.0.0, not localhost
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend server is running on port ${port}`);
    
    // Keep the process alive and log any post-startup issues
    setInterval(() => {
      console.log('🔄 Server health check - still running...');
    }, 30000); // Log every 30 seconds to verify server stays alive
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚫 Uncaught Exception thrown:', error);
  process.exit(1);
});

bootstrap();
