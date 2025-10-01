import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      hasDatabase: !!process.env.DATABASE_URL,
      port: process.env.PORT || '3000'
    };
  }

  @Get('env-check')
  getEnvCheck() {
    return {
      NODE_ENV: process.env.NODE_ENV || 'not-set',
      PORT: process.env.PORT || 'not-set',
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not-set',
      timestamp: new Date().toISOString()
    };
  }
}
