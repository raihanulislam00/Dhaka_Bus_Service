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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const driver_1 = require("./entities/driver");
const schedule_entity_1 = require("../admin/entities/schedule.entity");
const route_entity_1 = require("../admin/entities/route.entity");
let DriverService = class DriverService {
    driverRepo;
    scheduleRepo;
    routeRepo;
    jwtService;
    drivers = [];
    constructor(driverRepo, scheduleRepo, routeRepo, jwtService) {
        this.driverRepo = driverRepo;
        this.scheduleRepo = scheduleRepo;
        this.routeRepo = routeRepo;
        this.jwtService = jwtService;
    }
    async createDriver(driverDto) {
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
    async findDriverById(id) {
        const driver = await this.driverRepo.findOne({ where: { id } });
        if (!driver) {
            return { message: 'Driver not found' };
        }
        return driver;
    }
    createDriverInDB(createDriverDto) {
        const driver = this.driverRepo.create(createDriverDto);
        return this.driverRepo.save(driver);
    }
    async updateDriverStatus(id, dto) {
        const result = await this.driverRepo.update(id, { status: dto.status });
        return result.affected
            ? { message: 'Status updated' }
            : { message: 'Driver not found' };
    }
    getInactiveDrivers() {
        return this.driverRepo.find({ where: { status: 'inactive' } });
    }
    getDriversOlderThan(age) {
        return this.driverRepo
            .createQueryBuilder('driver')
            .where('driver.age > :age', { age })
            .getMany();
    }
    async register(createDriverDto) {
        const existingDriver = await this.driverRepo.findOne({
            where: { username: createDriverDto.username }
        });
        if (existingDriver) {
            throw new common_1.ConflictException(`Username '${createDriverDto.username}' already exists`);
        }
        const driver = this.driverRepo.create(createDriverDto);
        return await this.driverRepo.save(driver);
    }
    async login(loginDriverDto) {
        const driver = await this.driverRepo.findOne({
            where: { username: loginDriverDto.username }
        });
        if (!driver) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await driver.validatePassword(loginDriverDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async findByUsername(username) {
        const driver = await this.driverRepo.findOne({
            where: { username }
        });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with username '${username}' not found`);
        }
        return driver;
    }
    async getAvailableSchedules() {
        return await this.scheduleRepo
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.route', 'route')
            .where('schedule.assignedDriverId IS NULL')
            .andWhere('schedule.isActive = :isActive', { isActive: true })
            .orderBy('schedule.dayOfWeek', 'ASC')
            .addOrderBy('schedule.departureTime', 'ASC')
            .getMany();
    }
    async getDriverSchedules(driverId) {
        return await this.scheduleRepo.find({
            where: { assignedDriverId: driverId },
            relations: ['route'],
            order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
        });
    }
    async selectSchedule(driverId, scheduleId) {
        const driver = await this.driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${driverId} not found`);
        }
        const schedule = await this.scheduleRepo.findOne({
            where: { id: scheduleId },
            relations: ['route'],
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
        }
        if (schedule.assignedDriverId !== null) {
            throw new common_1.ConflictException('Schedule is already assigned to another driver');
        }
        schedule.assignedDriverId = driverId;
        return await this.scheduleRepo.save(schedule);
    }
    async unselectSchedule(driverId, scheduleId) {
        const driver = await this.driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${driverId} not found`);
        }
        const schedule = await this.scheduleRepo.findOne({
            where: { id: scheduleId },
            relations: ['route'],
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
        }
        if (schedule.assignedDriverId !== driverId) {
            throw new common_1.ConflictException('Schedule is not assigned to this driver');
        }
        schedule.assignedDriverId = null;
        return await this.scheduleRepo.save(schedule);
    }
    async getAllRoutes() {
        return await this.routeRepo.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async updateDriverLocation(driverId, locationDto) {
        const driver = await this.driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${driverId} not found`);
        }
        driver.currentLatitude = locationDto.latitude;
        driver.currentLongitude = locationDto.longitude;
        driver.lastLocationUpdate = new Date();
        return await this.driverRepo.save(driver);
    }
    async getDriverLocation(driverId) {
        const driver = await this.driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${driverId} not found`);
        }
        return {
            latitude: driver.currentLatitude,
            longitude: driver.currentLongitude,
            lastUpdate: driver.lastLocationUpdate
        };
    }
    async getAllDriversWithLocation() {
        return await this.driverRepo.find({
            select: ['id', 'fullName', 'username', 'status', 'currentLatitude', 'currentLongitude', 'lastLocationUpdate'],
            order: { createdAt: 'DESC' }
        });
    }
    async updateDriverDetails(driverId, updateData) {
        const driver = await this.driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${driverId} not found`);
        }
        const { password, ...safeUpdateData } = updateData;
        Object.assign(driver, safeUpdateData);
        return await this.driverRepo.save(driver);
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_1.Driver)),
    __param(1, (0, typeorm_1.InjectRepository)(schedule_entity_1.ScheduleEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(route_entity_1.RouteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], DriverService);
//# sourceMappingURL=driver.service.js.map