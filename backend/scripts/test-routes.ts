// Simple test script to check route API
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RouteService } from '../src/admin/services/route.service';

async function testRoutes() {
  try {
    console.log('🔍 Testing Route API...');
    
    const app = await NestFactory.create(AppModule);
    const routeService = app.get(RouteService);
    
    console.log('✅ Application started successfully');
    
    // Test getting all routes
    const routes = await routeService.findAll();
    console.log('📍 Routes found:', routes.length);
    
    routes.forEach((route, index) => {
      console.log(`${index + 1}. ${route.name} - ${route.startLocation} to ${route.endLocation} (₹${route.fare})`);
    });
    
    await app.close();
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error testing routes:', error);
  }
}

testRoutes();