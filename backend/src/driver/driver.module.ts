import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver';
import { ScheduleEntity } from '../admin/entities/schedule.entity';
import { RouteEntity } from '../admin/entities/route.entity';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, ScheduleEntity, RouteEntity]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
