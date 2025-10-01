import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { UpdateStatusDto } from './update-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Driver } from './entities/driver';
import { ScheduleEntity } from '../admin/entities/schedule.entity';
import { RouteEntity } from '../admin/entities/route.entity';

@Injectable()
export class DriverService {
  private drivers: CreateDriverDto[] = [];

  constructor(
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepo: Repository<ScheduleEntity>,
    @InjectRepository(RouteEntity)
    private routeRepo: Repository<RouteEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // ========== In-Memory Operations ==========
  async createDriver(driverDto: CreateDriverDto) {
    await this.driverRepo.save(driverDto);
    return {
      message: 'Driver created successfully',
      data: driverDto,
    };
  }

  findAllDrivers() {
    return this.driverRepo.find({
      order: { createdAt: 'DESC' }
    });
  }

  findAllActiveDrivers() {
    return this.driverRepo.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' }
    });
  }

  async findDriverById(id: number) {
    const driver = await this.driverRepo.findOne({ where: { id } });
    if (!driver) {
      return { message: 'Driver not found' };
    }
    return driver;
  }

  // ========== Database Operations ==========
  createDriverInDB(createDriverDto: CreateDriverDto) {
    const driver = this.driverRepo.create(createDriverDto);
    return this.driverRepo.save(driver);
  }

  async updateDriverStatus(id: number, dto: UpdateStatusDto) {
    const result = await this.driverRepo.update(id, { status: dto.status });
    return result.affected
      ? { message: 'Status updated' }
      : { message: 'Driver not found' };
  }

  getInactiveDrivers() {
    return this.driverRepo.find({ where: { status: 'inactive' } });
  }

  getDriversOlderThan(age: number) {
    return this.driverRepo
      .createQueryBuilder('driver')
      .where('driver.age > :age', { age })
      .getMany();
  }

  // Authentication methods
  async register(createDriverDto: CreateDriverDto): Promise<Driver> {
    // Check if username already exists
    const existingDriver = await this.driverRepo.findOne({
      where: { username: createDriverDto.username }
    });

    if (existingDriver) {
      throw new ConflictException(`Username '${createDriverDto.username}' already exists`);
    }

    const driver = this.driverRepo.create(createDriverDto);
    return await this.driverRepo.save(driver);
  }

  async login(loginDriverDto: LoginDriverDto) {
    const driver = await this.driverRepo.findOne({
      where: { username: loginDriverDto.username }
    });

    if (!driver) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await driver.validatePassword(loginDriverDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: driver.username, sub: driver.id, role: 'driver' };
    const access_token = this.jwtService.sign(payload);
    
    return {
      access_token,
      driver: {
        id: driver.id,
        username: driver.username,
        fullName: driver.fullName,
        status: driver.status
      }
    };
  }

  async findByUsername(username: string): Promise<Driver> {
    const driver = await this.driverRepo.findOne({
      where: { username }
    });

    if (!driver) {
      throw new NotFoundException(`Driver with username '${username}' not found`);
    }

    return driver;
  }

  // Schedule Management Methods
  async getAvailableSchedules(): Promise<ScheduleEntity[]> {
    return await this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .where('schedule.assignedDriverId IS NULL')
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .orderBy('schedule.dayOfWeek', 'ASC')
      .addOrderBy('schedule.departureTime', 'ASC')
      .getMany();
  }

  async getDriverSchedules(driverId: number): Promise<ScheduleEntity[]> {
    return await this.scheduleRepo.find({
      where: { assignedDriverId: driverId },
      relations: ['route'],
      order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
    });
  }

  async selectSchedule(driverId: number, scheduleId: number): Promise<ScheduleEntity> {
    // Verify driver exists
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    // Find the schedule
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId },
      relations: ['route'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // Check if schedule is already assigned
    if (schedule.assignedDriverId !== null) {
      throw new ConflictException('Schedule is already assigned to another driver');
    }

    // Assign the driver to the schedule
    schedule.assignedDriverId = driverId;
    return await this.scheduleRepo.save(schedule);
  }

  async unselectSchedule(driverId: number, scheduleId: number): Promise<ScheduleEntity> {
    // Verify driver exists
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    // Find the schedule
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId },
      relations: ['route'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // Check if schedule is assigned to this driver
    if (schedule.assignedDriverId !== driverId) {
      throw new ConflictException('Schedule is not assigned to this driver');
    }

    // Unassign the driver from the schedule
    schedule.assignedDriverId = null;
    return await this.scheduleRepo.save(schedule);
  }

  async getAllRoutes(): Promise<RouteEntity[]> {
    return await this.routeRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  // Location tracking methods
  async updateDriverLocation(driverId: number, locationDto: UpdateLocationDto): Promise<Driver> {
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    driver.currentLatitude = locationDto.latitude;
    driver.currentLongitude = locationDto.longitude;
    driver.lastLocationUpdate = new Date();

    return await this.driverRepo.save(driver);
  }

  async getDriverLocation(driverId: number): Promise<{ latitude?: number, longitude?: number, lastUpdate?: Date }> {
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    return {
      latitude: driver.currentLatitude,
      longitude: driver.currentLongitude,
      lastUpdate: driver.lastLocationUpdate
    };
  }

  async getAllDriversWithLocation(): Promise<Driver[]> {
    return await this.driverRepo.find({
      select: ['id', 'fullName', 'username', 'status', 'currentLatitude', 'currentLongitude', 'lastLocationUpdate'],
      order: { createdAt: 'DESC' }
    });
  }

  // Admin methods for driver management
  async updateDriverDetails(driverId: number, updateData: Partial<Driver>): Promise<Driver> {
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    // Don't allow updating password directly through this method
    const { password, ...safeUpdateData } = updateData as any;
    
    Object.assign(driver, safeUpdateData);
    return await this.driverRepo.save(driver);
  }
}
