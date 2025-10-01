"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_entity_1 = require("../entities/schedule.entity");
const route_service_1 = require("./route.service");
let ScheduleService = class ScheduleService {
    scheduleRepository;
    routeService;
    constructor(scheduleRepository, routeService) {
        this.scheduleRepository = scheduleRepository;
        this.routeService = routeService;
    }
    async create(createScheduleDto) {
        await this.routeService.findOne(createScheduleDto.routeId);
        await this.checkTimeConflict(createScheduleDto.busNumber, createScheduleDto.dayOfWeek, createScheduleDto.departureTime, createScheduleDto.arrivalTime);
        const schedule = this.scheduleRepository.create({
            ...createScheduleDto,
            availableSeats: createScheduleDto.totalSeats || 45,
        });
        return await this.scheduleRepository.save(schedule);
    }
    async findAll() {
        return await this.scheduleRepository.find({
            relations: ['route'],
            order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
        });
    }
    async findByRoute(routeId) {
        return await this.scheduleRepository.find({
            where: { routeId, isActive: true },
            relations: ['route'],
            order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
        });
    }
    async findByDriver(driverId) {
        return await this.scheduleRepository.find({
            where: { assignedDriverId: driverId },
            relations: ['route'],
            order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
        });
    }
    async findAvailableForDriver() {
        return await this.scheduleRepository
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.route', 'route')
            .where('schedule.assignedDriverId IS NULL')
            .andWhere('schedule.isActive = :isActive', { isActive: true })
            .orderBy('schedule.dayOfWeek', 'ASC')
            .addOrderBy('schedule.departureTime', 'ASC')
            .getMany();
    }
    async findOne(id) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id },
            relations: ['route'],
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
        }
        return schedule;
    }
    async update(id, updateScheduleDto) {
        const existingSchedule = await this.findOne(id);
        if (updateScheduleDto.routeId) {
            await this.routeService.findOne(updateScheduleDto.routeId);
        }
        if (updateScheduleDto.busNumber ||
            updateScheduleDto.dayOfWeek ||
            updateScheduleDto.departureTime ||
            updateScheduleDto.arrivalTime) {
            await this.checkTimeConflict(updateScheduleDto.busNumber || existingSchedule.busNumber, updateScheduleDto.dayOfWeek || existingSchedule.dayOfWeek, updateScheduleDto.departureTime || existingSchedule.departureTime, updateScheduleDto.arrivalTime || existingSchedule.arrivalTime, id);
        }
        await this.scheduleRepository.update(id, updateScheduleDto);
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.scheduleRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
        }
    }
    async assignDriver(scheduleId, driverId) {
        const schedule = await this.findOne(scheduleId);
        schedule.assignedDriverId = driverId;
        return await this.scheduleRepository.save(schedule);
    }
    async unassignDriver(scheduleId) {
        const schedule = await this.findOne(scheduleId);
        schedule.assignedDriverId = null;
        return await this.scheduleRepository.save(schedule);
    }
    async toggleActive(id) {
        const schedule = await this.findOne(id);
        schedule.isActive = !schedule.isActive;
        return await this.scheduleRepository.save(schedule);
    }
    async checkTimeConflict(busNumber, dayOfWeek, departureTime, arrivalTime, excludeId) {
        const query = this.scheduleRepository
            .createQueryBuilder('schedule')
            .where('schedule.busNumber = :busNumber', { busNumber })
            .andWhere('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
            .andWhere('(schedule.departureTime <= :arrivalTime AND schedule.arrivalTime >= :departureTime)', { departureTime, arrivalTime });
        if (excludeId) {
            query.andWhere('schedule.id != :excludeId', { excludeId });
        }
        const conflictingSchedule = await query.getOne();
        if (conflictingSchedule) {
            throw new common_1.BadRequestException(`Schedule conflict: Bus ${busNumber} is already scheduled during this time on ${dayOfWeek}`);
        }
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_entity_1.ScheduleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        route_service_1.RouteService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map