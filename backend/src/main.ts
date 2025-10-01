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
      origin: ['http://localhost:8000', 'http://localhost:3001', 'http://localhost:3000'], // Allow frontend ports
      credentials: true,
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
    
    console.log('🚀 Backend server starting on port 3000...');
    await app.listen(process.env.PORT ?? 3000, 'localhost');
    console.log('✅ Backend server is running on http://localhost:3000');
    
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
