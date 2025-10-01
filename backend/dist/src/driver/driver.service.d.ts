import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { UpdateStatusDto } from './update-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Driver } from './entities/driver';
import { ScheduleEntity } from '../admin/entities/schedule.entity';
import { RouteEntity } from '../admin/entities/route.entity';
export declare class DriverService {
    private driverRepo;
    private scheduleRepo;
    private routeRepo;
    private readonly jwtService;
    private drivers;
    constructor(driverRepo: Repository<Driver>, scheduleRepo: Repository<ScheduleEntity>, routeRepo: Repository<RouteEntity>, jwtService: JwtService);
    createDriver(driverDto: CreateDriverDto): Promise<{
        message: string;
        data: CreateDriverDto;
    }>;
    findAllDrivers(): Promise<Driver[]>;
    findAllActiveDrivers(): Promise<Driver[]>;
    findDriverById(id: number): Promise<Driver | {
        message: string;
    }>;
    createDriverInDB(createDriverDto: CreateDriverDto): Promise<Driver>;
    updateDriverStatus(id: number, dto: UpdateStatusDto): Promise<{
        message: string;
    }>;
    getInactiveDrivers(): Promise<Driver[]>;
    getDriversOlderThan(age: number): Promise<Driver[]>;
    register(createDriverDto: CreateDriverDto): Promise<Driver>;
    login(loginDriverDto: LoginDriverDto): Promise<{
        access_token: string;
        driver: {
            id: number;
            username: string;
            fullName: string;
            status: "active" | "inactive";
        };
    }>;
    findByUsername(username: string): Promise<Driver>;
    getAvailableSchedules(): Promise<ScheduleEntity[]>;
    getDriverSchedules(driverId: number): Promise<ScheduleEntity[]>;
    selectSchedule(driverId: number, scheduleId: number): Promise<ScheduleEntity>;
    unselectSchedule(driverId: number, scheduleId: number): Promise<ScheduleEntity>;
    getAllRoutes(): Promise<RouteEntity[]>;
    updateDriverLocation(driverId: number, locationDto: UpdateLocationDto): Promise<Driver>;
    getDriverLocation(driverId: number): Promise<{
        latitude?: number;
        longitude?: number;
        lastUpdate?: Date;
    }>;
    getAllDriversWithLocation(): Promise<Driver[]>;
    updateDriverDetails(driverId: number, updateData: Partial<Driver>): Promise<Driver>;
}
