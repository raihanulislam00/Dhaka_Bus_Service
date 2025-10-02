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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dhaka-bus-service-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            // PostgreSQL configuration for production (Railway)
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            entities: [Driver, Passenger, Ticket, AdminEntity, RouteEntity, ScheduleEntity],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
            retryAttempts: 5,
            retryDelay: 3000,
            logging: ['error'],
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            },
          }
        : {
            // SQLite configuration for development
            type: 'sqlite',
            database: './dhaka_bus_service.sqlite',
            autoLoadEntities: true,
            entities: [Driver, Passenger, Ticket, AdminEntity, RouteEntity, ScheduleEntity],
            synchronize: true,
            logging: process.env.NODE_ENV !== 'production',
          }
    ),
    DriverModule,
    PassengerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}