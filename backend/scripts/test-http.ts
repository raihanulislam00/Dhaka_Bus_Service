// Simple HTTP test
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function testHTTPServer() {
  try {
    console.log('🚀 Starting HTTP server test...');
    
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:8000', 'http://localhost:3001', 'http://localhost:3000'],
      credentials: true,
    });
    
    console.log('📡 Starting server on port 3001 (different port)...');
    
    await app.listen(3001, '0.0.0.0');
    console.log('✅ Server is running on http://localhost:3001');
    
    // Keep server running for testing
    console.log('🔄 Server will stay running for 30 seconds for testing...');
    
    setTimeout(async () => {
      console.log('🛑 Shutting down server...');
      await app.close();
      console.log('✅ Server shutdown complete');
    }, 30000);
    
  } catch (error) {
    console.error('❌ Error starting HTTP server:', error);
  }
}

testHTTPServer();