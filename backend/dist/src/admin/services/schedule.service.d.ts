import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entities/schedule.entity';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { RouteService } from './route.service';
export declare class ScheduleService {
    private readonly scheduleRepository;
    private readonly routeService;
    constructor(scheduleRepository: Repository<ScheduleEntity>, routeService: RouteService);
    create(createScheduleDto: CreateScheduleDto): Promise<ScheduleEntity>;
    findAll(): Promise<ScheduleEntity[]>;
    findByRoute(routeId: number): Promise<ScheduleEntity[]>;
    findByDriver(driverId: number): Promise<ScheduleEntity[]>;
    findAvailableForDriver(): Promise<ScheduleEntity[]>;
    findOne(id: number): Promise<ScheduleEntity>;
    update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleEntity>;
    remove(id: number): Promise<void>;
    assignDriver(scheduleId: number, driverId: number): Promise<ScheduleEntity>;
    unassignDriver(scheduleId: number): Promise<ScheduleEntity>;
    toggleActive(id: number): Promise<ScheduleEntity>;
    private checkTimeConflict;
}
