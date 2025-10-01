import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RouteService } from './services/route.service';
import { ScheduleService } from './services/schedule.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { RouteEntity } from './entities/route.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { Driver } from '../driver/entities/driver';
import { DriverService } from '../driver/driver.service';
import { Passenger } from '../passenger/entities/passenger.entities';
import { Ticket } from '../passenger/entities/ticket.entity';
import { PassengerService } from '../passenger/passenger.service';
import { EmailService } from '../passenger/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, RouteEntity, ScheduleEntity, Driver, Passenger, Ticket]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // In production, use environment variables
      signOptions: { expiresIn: '1h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, RouteService, ScheduleService, DriverService, PassengerService, EmailService, AdminJwtStrategy]
})
export class AdminModule {}