import { AdminService } from './admin.service';
import { RouteService } from './services/route.service';
import { ScheduleService } from './services/schedule.service';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AdminEntity } from './entities/admin.entity';
import { RouteEntity } from './entities/route.entity';
import { ScheduleEntity } from './entities/schedule.entity';
export declare class AdminController {
    private readonly adminservice;
    private readonly routeService;
    private readonly scheduleService;
    private readonly driverService;
    private readonly passengerService;
    constructor(adminservice: AdminService, routeService: RouteService, scheduleService: ScheduleService, driverService: DriverService, passengerService: PassengerService);
    findAll(): Promise<AdminEntity[]>;
    findWithDefaultCountry(): Promise<AdminEntity[]>;
    create(createAdminData: CreateAdminDto): Promise<AdminEntity>;
    update(id: number, updateAdminData: UpdateAdminDto): Promise<AdminEntity>;
    remove(id: number): Promise<void>;
    updateCountry(id: number, country: string): Promise<AdminEntity>;
    findByJoiningDate(date: Date): Promise<AdminEntity[]>;
    createWithPhoto(photo: any, createAdminData: CreateAdminDto): Promise<AdminEntity>;
    login(loginAdminDto: LoginAdminDto): Promise<{
        access_token: string;
        admin: {
            id: number;
            username: string;
            name: string;
            mail: string;
        };
    }>;
    createRoute(createRouteDto: CreateRouteDto): Promise<RouteEntity>;
    findAllRoutes(): Promise<RouteEntity[]>;
    searchRoutes(startLocation?: string, endLocation?: string): Promise<RouteEntity[]>;
    findActiveRoutes(): Promise<RouteEntity[]>;
    findOneRoute(id: number): Promise<RouteEntity>;
    updateRoute(id: number, updateRouteDto: UpdateRouteDto): Promise<RouteEntity>;
    removeRoute(id: number): Promise<void>;
    toggleRouteActive(id: number): Promise<RouteEntity>;
    createSchedule(createScheduleDto: CreateScheduleDto): Promise<ScheduleEntity>;
    findAllSchedules(): Promise<ScheduleEntity[]>;
    findSchedulesByRoute(routeId: number): Promise<ScheduleEntity[]>;
    findAvailableSchedules(): Promise<ScheduleEntity[]>;
    findOneSchedule(id: number): Promise<ScheduleEntity>;
    updateSchedule(id: number, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleEntity>;
    removeSchedule(id: number): Promise<void>;
    assignDriverToSchedule(scheduleId: number, driverId: number): Promise<ScheduleEntity>;
    unassignDriverFromSchedule(scheduleId: number): Promise<ScheduleEntity>;
    toggleScheduleActive(id: number): Promise<ScheduleEntity>;
    getAllDrivers(): Promise<import("../driver/entities/driver").Driver[]>;
    getAllActiveDrivers(): Promise<import("../driver/entities/driver").Driver[]>;
    getAllDriversWithLocation(): Promise<import("../driver/entities/driver").Driver[]>;
    updateDriverStatus(id: number, statusDto: {
        status: 'active' | 'inactive';
    }): Promise<{
        message: string;
    }>;
    updateDriverDetails(id: number, updateData: any): Promise<import("../driver/entities/driver").Driver>;
    getDriverLocation(id: number): Promise<{
        latitude?: number;
        longitude?: number;
        lastUpdate?: Date;
    }>;
    getAllPassengers(): Promise<import("../passenger/entities/passenger.entities").Passenger[]>;
    searchPassengers(name: string): Promise<import("../passenger/entities/passenger.entities").Passenger[]>;
    getPassengerById(id: number): Promise<import("../passenger/entities/passenger.entities").Passenger>;
    getPassengerTickets(passengerId: number): Promise<import("../passenger/entities/ticket.entity").Ticket[]>;
    updatePassengerStatus(id: number, statusDto: {
        isActive: boolean;
    }): Promise<import("../passenger/entities/passenger.entities").Passenger>;
    deletePassenger(id: number): Promise<{
        message: string;
    }>;
    findOne(id: number): Promise<AdminEntity>;
}
