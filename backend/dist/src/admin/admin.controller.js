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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const admin_service_1 = require("./admin.service");
const route_service_1 = require("./services/route.service");
const schedule_service_1 = require("./services/schedule.service");
const driver_service_1 = require("../driver/driver.service");
const passenger_service_1 = require("../passenger/passenger.service");
const createAdmin_dto_1 = require("./dto/createAdmin.dto");
const updateAdmin_dto_1 = require("./dto/updateAdmin.dto");
const login_admin_dto_1 = require("./dto/login-admin.dto");
const create_route_dto_1 = require("./dto/create-route.dto");
const update_route_dto_1 = require("./dto/update-route.dto");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const admin_exist_pipe_1 = require("./pipes/admin-exist.pipe");
const admin_jwt_auth_guard_1 = require("./guards/admin-jwt-auth.guard");
const parse_date_pipe_1 = require("./pipes/parse-date.pipe");
let AdminController = class AdminController {
    adminservice;
    routeService;
    scheduleService;
    driverService;
    passengerService;
    constructor(adminservice, routeService, scheduleService, driverService, passengerService) {
        this.adminservice = adminservice;
        this.routeService = routeService;
        this.scheduleService = scheduleService;
        this.driverService = driverService;
        this.passengerService = passengerService;
    }
    async findAll() {
        return this.adminservice.findAll();
    }
    async findWithDefaultCountry() {
        return this.adminservice.findWithDefaultCountry();
    }
    async create(createAdminData) {
        return this.adminservice.create(createAdminData);
    }
    async update(id, updateAdminData) {
        return this.adminservice.update(id, updateAdminData);
    }
    async remove(id) {
        await this.adminservice.remove(id);
    }
    async updateCountry(id, country) {
        return this.adminservice.updateCountry(id, country);
    }
    async findByJoiningDate(date) {
        return this.adminservice.findByJoiningDate(date);
    }
    async createWithPhoto(photo, createAdminData) {
        const newAdmin = await this.adminservice.create(createAdminData);
        if (photo) {
            return this.adminservice.updatePhotoPath(newAdmin.id, photo.filename);
        }
        return newAdmin;
    }
    async login(loginAdminDto) {
        return this.adminservice.login(loginAdminDto);
    }
    async createRoute(createRouteDto) {
        return this.routeService.create(createRouteDto);
    }
    async findAllRoutes() {
        return this.routeService.findAll();
    }
    async searchRoutes(startLocation, endLocation) {
        return this.routeService.findByLocation(startLocation, endLocation);
    }
    async findActiveRoutes() {
        return this.routeService.findActive();
    }
    async findOneRoute(id) {
        return this.routeService.findOne(id);
    }
    async updateRoute(id, updateRouteDto) {
        return this.routeService.update(id, updateRouteDto);
    }
    async removeRoute(id) {
        await this.routeService.remove(id);
    }
    async toggleRouteActive(id) {
        return this.routeService.toggleActive(id);
    }
    async createSchedule(createScheduleDto) {
        return this.scheduleService.create(createScheduleDto);
    }
    async findAllSchedules() {
        return this.scheduleService.findAll();
    }
    async findSchedulesByRoute(routeId) {
        return this.scheduleService.findByRoute(routeId);
    }
    async findAvailableSchedules() {
        return this.scheduleService.findAvailableForDriver();
    }
    async findOneSchedule(id) {
        return this.scheduleService.findOne(id);
    }
    async updateSchedule(id, updateScheduleDto) {
        return this.scheduleService.update(id, updateScheduleDto);
    }
    async removeSchedule(id) {
        await this.scheduleService.remove(id);
    }
    async assignDriverToSchedule(scheduleId, driverId) {
        return this.scheduleService.assignDriver(scheduleId, driverId);
    }
    async unassignDriverFromSchedule(scheduleId) {
        return this.scheduleService.unassignDriver(scheduleId);
    }
    async toggleScheduleActive(id) {
        return this.scheduleService.toggleActive(id);
    }
    async getAllDrivers() {
        return this.driverService.findAllDrivers();
    }
    async getAllActiveDrivers() {
        return this.driverService.findAllActiveDrivers();
    }
    async getAllDriversWithLocation() {
        return this.driverService.getAllDriversWithLocation();
    }
    async updateDriverStatus(id, statusDto) {
        return this.driverService.updateDriverStatus(id, statusDto);
    }
    async updateDriverDetails(id, updateData) {
        return this.driverService.updateDriverDetails(id, updateData);
    }
    async getDriverLocation(id) {
        return this.driverService.getDriverLocation(id);
    }
    async getAllPassengers() {
        return this.passengerService.findAll();
    }
    async searchPassengers(name) {
        if (!name || name.trim() === '') {
            return this.passengerService.findAll();
        }
        return this.passengerService.findByFullNameSubstring(name);
    }
    async getPassengerById(id) {
        return this.passengerService.findById(id);
    }
    async getPassengerTickets(passengerId) {
        return this.passengerService.getPassengerTickets(passengerId);
    }
    async updatePassengerStatus(id, statusDto) {
        return this.passengerService.update(id, { isActive: statusDto.isActive });
    }
    async deletePassenger(id) {
        const passenger = await this.passengerService.findById(id);
        return this.passengerService.removeByUsername(passenger.username);
    }
    async findOne(id) {
        return this.adminservice.findOne(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('defaultCountry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findWithDefaultCountry", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAdmin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, admin_exist_pipe_1.AdminExistPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateAdmin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, admin_exist_pipe_1.AdminExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/country'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, admin_exist_pipe_1.AdminExistPipe)),
    __param(1, (0, common_1.Body)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCountry", null);
__decorate([
    (0, common_1.Get)('byJoiningDate/:date'),
    __param(0, (0, common_1.Param)('date', parse_date_pipe_1.ParseDatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByJoiningDate", null);
__decorate([
    (0, common_1.Post)('registerWithPhoto'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    })),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
                cb(null, true);
            }
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 2 * 1024 * 1024 },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/photos',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            },
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createAdmin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createWithPhoto", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_admin_dto_1.LoginAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('routes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_route_dto_1.CreateRouteDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createRoute", null);
__decorate([
    (0, common_1.Get)('routes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllRoutes", null);
__decorate([
    (0, common_1.Get)('routes/search'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchRoutes", null);
__decorate([
    (0, common_1.Get)('routes/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findActiveRoutes", null);
__decorate([
    (0, common_1.Get)('routes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOneRoute", null);
__decorate([
    (0, common_1.Put)('routes/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_route_dto_1.UpdateRouteDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRoute", null);
__decorate([
    (0, common_1.Delete)('routes/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeRoute", null);
__decorate([
    (0, common_1.Patch)('routes/:id/toggle'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleRouteActive", null);
__decorate([
    (0, common_1.Post)('schedules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/route/:routeId'),
    __param(0, (0, common_1.Param)('routeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findSchedulesByRoute", null);
__decorate([
    (0, common_1.Get)('schedules/available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAvailableSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOneSchedule", null);
__decorate([
    (0, common_1.Put)('schedules/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeSchedule", null);
__decorate([
    (0, common_1.Patch)('schedules/:id/assign-driver/:driverId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('driverId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignDriverToSchedule", null);
__decorate([
    (0, common_1.Patch)('schedules/:id/unassign-driver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unassignDriverFromSchedule", null);
__decorate([
    (0, common_1.Patch)('schedules/:id/toggle'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleScheduleActive", null);
__decorate([
    (0, common_1.Get)('drivers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDrivers", null);
__decorate([
    (0, common_1.Get)('drivers/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllActiveDrivers", null);
__decorate([
    (0, common_1.Get)('drivers/with-location'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDriversWithLocation", null);
__decorate([
    (0, common_1.Patch)('drivers/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDriverStatus", null);
__decorate([
    (0, common_1.Patch)('drivers/:id/details'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDriverDetails", null);
__decorate([
    (0, common_1.Get)('drivers/:id/location'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDriverLocation", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Get)('passengers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPassengers", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Get)('passengers/search'),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchPassengers", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Get)('passengers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Get)('passengers/:id/tickets'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPassengerTickets", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Patch)('passengers/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePassengerStatus", null);
__decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Delete)('passengers/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePassenger", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, admin_exist_pipe_1.AdminExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOne", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        route_service_1.RouteService,
        schedule_service_1.ScheduleService,
        driver_service_1.DriverService,
        passenger_service_1.PassengerService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map