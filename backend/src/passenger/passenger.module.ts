import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { EmailService } from './services/email.service';
import { RouteService } from '../admin/services/route.service';
import { ScheduleService } from '../admin/services/schedule.service';
import { Passenger } from './entities/passenger.entities';
import { Ticket } from './entities/ticket.entity';
import { RouteEntity } from '../admin/entities/route.entity';
import { ScheduleEntity } from '../admin/entities/schedule.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Passenger, Ticket, RouteEntity, ScheduleEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // In production, use environment variables
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PassengerController],
  providers: [PassengerService, JwtStrategy, EmailService, RouteService, ScheduleService]
})
export class PassengerModule {}
