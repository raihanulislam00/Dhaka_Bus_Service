import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { UpdateStatusDto } from './update-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Response } from 'express';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    createDriver(driverDto: CreateDriverDto, nidImage: any): Promise<{
        message: string;
        data: CreateDriverDto;
    }>;
    getDriverById(id: number): Promise<import("./entities/driver").Driver | {
        message: string;
    }>;
    getAllDrivers(): Promise<import("./entities/driver").Driver[]>;
    getAllActiveDrivers(): Promise<import("./entities/driver").Driver[]>;
    getAllDriversWithLocation(): Promise<import("./entities/driver").Driver[]>;
    getNidImage(name: string, res: Response): void;
    updateStatus(id: number, dto: UpdateStatusDto): Promise<{
        message: string;
    }>;
    getInactiveDrivers(): Promise<import("./entities/driver").Driver[]>;
    getDriversOlderThan(age: number): Promise<import("./entities/driver").Driver[]>;
    register(createDriverDto: CreateDriverDto): Promise<import("./entities/driver").Driver>;
    login(loginDriverDto: LoginDriverDto): Promise<{
        access_token: string;
        driver: {
            id: number;
            username: string;
            fullName: string;
            status: "inactive" | "active";
        };
    }>;
    getAvailableSchedules(): Promise<import("../admin/entities/schedule.entity").ScheduleEntity[]>;
    getDriverSchedules(driverId: number): Promise<import("../admin/entities/schedule.entity").ScheduleEntity[]>;
    selectSchedule(driverId: number, scheduleId: number): Promise<import("../admin/entities/schedule.entity").ScheduleEntity>;
    unselectSchedule(driverId: number, scheduleId: number): Promise<import("../admin/entities/schedule.entity").ScheduleEntity>;
    getAllRoutes(): Promise<import("../admin/entities/route.entity").RouteEntity[]>;
    updateDriverLocation(id: number, locationDto: UpdateLocationDto): Promise<import("./entities/driver").Driver>;
    getDriverLocation(id: number): Promise<{
        latitude?: number;
        longitude?: number;
        lastUpdate?: Date;
    }>;
    updateDriverDetails(id: number, updateData: any): Promise<import("./entities/driver").Driver>;
}
