import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entities/schedule.entity';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { RouteService } from './route.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly routeService: RouteService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<ScheduleEntity> {
    // Verify route exists
    await this.routeService.findOne(createScheduleDto.routeId);

    // Check for time conflicts
    await this.checkTimeConflict(
      createScheduleDto.busNumber,
      createScheduleDto.dayOfWeek,
      createScheduleDto.departureTime,
      createScheduleDto.arrivalTime,
    );

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      availableSeats: createScheduleDto.totalSeats || 45,
    });

    return await this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository.find({
      relations: ['route'],
      order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
    });
  }

  async findByRoute(routeId: number): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository.find({
      where: { routeId, isActive: true },
      relations: ['route'],
      order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
    });
  }

  async findByDriver(driverId: number): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository.find({
      where: { assignedDriverId: driverId },
      relations: ['route'],
      order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
    });
  }

  async findAvailableForDriver(): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .where('schedule.assignedDriverId IS NULL')
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .orderBy('schedule.dayOfWeek', 'ASC')
      .addOrderBy('schedule.departureTime', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<ScheduleEntity> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['route'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleEntity> {
    const existingSchedule = await this.findOne(id);

    // If updating route, verify it exists
    if (updateScheduleDto.routeId) {
      await this.routeService.findOne(updateScheduleDto.routeId);
    }

    // Check for time conflicts if times or day are being updated
    if (
      updateScheduleDto.busNumber ||
      updateScheduleDto.dayOfWeek ||
      updateScheduleDto.departureTime ||
      updateScheduleDto.arrivalTime
    ) {
      await this.checkTimeConflict(
        updateScheduleDto.busNumber || existingSchedule.busNumber,
        updateScheduleDto.dayOfWeek || existingSchedule.dayOfWeek,
        updateScheduleDto.departureTime || existingSchedule.departureTime,
        updateScheduleDto.arrivalTime || existingSchedule.arrivalTime,
        id,
      );
    }

    await this.scheduleRepository.update(id, updateScheduleDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }

  async assignDriver(scheduleId: number, driverId: number): Promise<ScheduleEntity> {
    const schedule = await this.findOne(scheduleId);
    schedule.assignedDriverId = driverId;
    return await this.scheduleRepository.save(schedule);
  }

  async unassignDriver(scheduleId: number): Promise<ScheduleEntity> {
    const schedule = await this.findOne(scheduleId);
    schedule.assignedDriverId = null;
    return await this.scheduleRepository.save(schedule);
  }

  async toggleActive(id: number): Promise<ScheduleEntity> {
    const schedule = await this.findOne(id);
    schedule.isActive = !schedule.isActive;
    return await this.scheduleRepository.save(schedule);
  }

  async findAvailableForBooking(): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('route.isActive = :routeActive', { routeActive: true })
      .andWhere('schedule.availableSeats > 0')
      .orderBy('schedule.dayOfWeek', 'ASC')
      .addOrderBy('schedule.departureTime', 'ASC')
      .getMany();
  }

  private async checkTimeConflict(
    busNumber: string,
    dayOfWeek: string,
    departureTime: string,
    arrivalTime: string,
    excludeId?: number,
  ): Promise<void> {
    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.busNumber = :busNumber', { busNumber })
      .andWhere('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere(
        '(schedule.departureTime <= :arrivalTime AND schedule.arrivalTime >= :departureTime)',
        { departureTime, arrivalTime },
      );

    if (excludeId) {
      query.andWhere('schedule.id != :excludeId', { excludeId });
    }

    const conflictingSchedule = await query.getOne();
    if (conflictingSchedule) {
      throw new BadRequestException(
        `Schedule conflict: Bus ${busNumber} is already scheduled during this time on ${dayOfWeek}`,
      );
    }
  }
}