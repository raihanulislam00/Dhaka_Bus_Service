import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver.module';
import { AdminModule } from './admin/admin.module';
import { Driver } from './driver/entities/driver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './passenger/entities/passenger.entities';
import { Ticket } from './passenger/entities/ticket.entity';
import { AdminEntity } from './admin/entities/admin.entity';
import { RouteEntity } from './admin/entities/route.entity';
import { ScheduleEntity } from './admin/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dhaka-bus-service-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'passenger',
      autoLoadEntities: true,
      entities: [Driver, Passenger, Ticket, AdminEntity, RouteEntity, ScheduleEntity],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      retryAttempts: 3,
      retryDelay: 3000,
    }),
    DriverModule,
    PassengerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}