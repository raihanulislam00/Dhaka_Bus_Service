import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔧 Database URL exists:', !!process.env.DATABASE_URL);
    console.log('🔧 Starting NestJS application...');
    
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    console.log('✅ NestJS application created successfully');
    
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
    
    console.log('✅ CORS configured');
    
    // Only configure static assets if not using ServeStaticModule
    // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    //   prefix: '/uploads/',
    // });
    
    app.useGlobalPipes(new ValidationPipe({
       whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    }));
    
    console.log('✅ Global pipes configured');
    
    const port = process.env.PORT ?? 3000;
    console.log('🚀 Starting server on port:', port);
    console.log('🌍 Binding to 0.0.0.0 for Railway compatibility');
    
    // Railway requires binding to 0.0.0.0, not localhost
    await app.listen(port, '0.0.0.0');
    console.log(`🎉 Backend server is successfully running on port ${port}`);
    console.log(`🌐 Server available at: http://0.0.0.0:${port}`);
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    console.error('📋 Error stack:', error.stack);
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
