// Temporary stable server for testing
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function startStableServer() {
  try {
    console.log('🚀 Starting stable backend server...');
    
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:8000', 'http://localhost:3001', 'http://localhost:3000'],
      credentials: true,
    });
    
    console.log('📡 Server will listen on localhost:3000...');
    await app.listen(3000, 'localhost');
    
    console.log('✅ Stable server running on http://localhost:3000');
    console.log('🔄 Use Ctrl+C to stop');
    
    // Keep alive
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await app.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startStableServer();