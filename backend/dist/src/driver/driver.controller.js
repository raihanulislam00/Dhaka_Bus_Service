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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const driver_service_1 = require("./driver.service");
const create_driver_dto_1 = require("./dto/create-driver.dto");
const login_driver_dto_1 = require("./dto/login-driver.dto");
const update_status_dto_1 = require("./update-status.dto");
const update_location_dto_1 = require("./dto/update-location.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const multer_2 = require("multer");
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    async createDriver(driverDto, nidImage) {
        if (!nidImage) {
            throw new common_1.BadRequestException('NID image is required and must be under 2MB');
        }
        driverDto.nidImage = nidImage.filename;
        return await this.driverService.createDriver(driverDto);
    }
    getDriverById(id) {
        return this.driverService.findDriverById(id);
    }
    getAllDrivers() {
        return this.driverService.findAllDrivers();
    }
    getAllActiveDrivers() {
        return this.driverService.findAllActiveDrivers();
    }
    getAllDriversWithLocation() {
        return this.driverService.getAllDriversWithLocation();
    }
    getNidImage(name, res) {
        return res.sendFile(name, { root: './uploads/nid' });
    }
    updateStatus(id, dto) {
        return this.driverService.updateDriverStatus(id, dto);
    }
    getInactiveDrivers() {
        return this.driverService.getInactiveDrivers();
    }
    getDriversOlderThan(age) {
        return this.driverService.getDriversOlderThan(age);
    }
    async register(createDriverDto) {
        return this.driverService.register(createDriverDto);
    }
    async login(loginDriverDto) {
        return this.driverService.login(loginDriverDto);
    }
    async getAvailableSchedules() {
        return this.driverService.getAvailableSchedules();
    }
    async getDriverSchedules(driverId) {
        return this.driverService.getDriverSchedules(driverId);
    }
    async selectSchedule(driverId, scheduleId) {
        return this.driverService.selectSchedule(driverId, scheduleId);
    }
    async unselectSchedule(driverId, scheduleId) {
        return this.driverService.unselectSchedule(driverId, scheduleId);
    }
    async getAllRoutes() {
        return this.driverService.getAllRoutes();
    }
    async updateDriverLocation(id, locationDto) {
        return this.driverService.updateDriverLocation(id, locationDto);
    }
    async getDriverLocation(id) {
        return this.driverService.getDriverLocation(id);
    }
    async updateDriverDetails(id, updateData) {
        return this.driverService.updateDriverDetails(id, updateData);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Post)('file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('nidImage', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|png)$/)) {
                return cb(new multer_2.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 2 * 1024 * 1024 },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/nid',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_driver_dto_1.CreateDriverDto, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "createDriver", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getDriverById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getAllDrivers", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getAllActiveDrivers", null);
__decorate([
    (0, common_1.Get)('with-location'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getAllDriversWithLocation", null);
__decorate([
    (0, common_1.Get)('nid/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getNidImage", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('inactive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getInactiveDrivers", null);
__decorate([
    (0, common_1.Get)('older-than/:age'),
    __param(0, (0, common_1.Param)('age', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getDriversOlderThan", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_driver_dto_1.LoginDriverDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('schedules/available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getAvailableSchedules", null);
__decorate([
    (0, common_1.Get)(':id/schedules'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getDriverSchedules", null);
__decorate([
    (0, common_1.Post)(':driverId/schedules/:scheduleId/select'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('scheduleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "selectSchedule", null);
__decorate([
    (0, common_1.Post)(':driverId/schedules/:scheduleId/unselect'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('scheduleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "unselectSchedule", null);
__decorate([
    (0, common_1.Get)('routes/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getAllRoutes", null);
__decorate([
    (0, common_1.Patch)(':id/location'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateDriverLocation", null);
__decorate([
    (0, common_1.Get)(':id/location'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getDriverLocation", null);
__decorate([
    (0, common_1.Patch)(':id/details'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateDriverDetails", null);
exports.DriverController = DriverController = __decorate([
    (0, common_1.Controller)('driver'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map