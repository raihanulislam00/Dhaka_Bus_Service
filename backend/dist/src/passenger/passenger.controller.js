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
exports.PassengerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const create_multiple_tickets_dto_1 = require("./dto/create-multiple-tickets.dto");
const update_ticket_status_dto_1 = require("./dto/update-ticket-status.dto");
const login_dto_1 = require("./dto/login.dto");
const passenger_service_1 = require("./passenger.service");
const createPassenger_dto_1 = require("./dto/createPassenger.dto");
const updatePassenger_dto_1 = require("./dto/updatePassenger.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const multer_2 = require("multer");
const route_service_1 = require("../admin/services/route.service");
const schedule_service_1 = require("../admin/services/schedule.service");
let PassengerController = class PassengerController {
    passengerService;
    routeService;
    scheduleService;
    constructor(passengerService, routeService, scheduleService) {
        this.passengerService = passengerService;
        this.routeService = routeService;
        this.scheduleService = scheduleService;
    }
    async login(loginDto) {
        return await this.passengerService.login(loginDto);
    }
    async createTicket(passengerId, createTicketDto) {
        return await this.passengerService.createTicket(passengerId, createTicketDto);
    }
    async createMultipleTickets(passengerId, createMultipleTicketsDto) {
        return await this.passengerService.createMultipleTickets(passengerId, createMultipleTicketsDto);
    }
    async getPassengerTickets(passengerId) {
        return await this.passengerService.getPassengerTickets(passengerId);
    }
    async getPassengerTicketsGrouped(passengerId) {
        return await this.passengerService.getPassengerTicketsGrouped(passengerId);
    }
    async cancelTicket(passengerId, ticketId) {
        return await this.passengerService.cancelTicket(passengerId, ticketId);
    }
    async cancelBookingGroup(passengerId, bookingGroupId) {
        return await this.passengerService.cancelBookingGroup(passengerId, bookingGroupId);
    }
    async updateTicketStatus(ticketId, updateTicketStatusDto) {
        return await this.passengerService.updateTicketStatus(ticketId, updateTicketStatusDto.status);
    }
    async create(createPassengerDto) {
        return await this.passengerService.create(createPassengerDto);
    }
    async findAll() {
        return await this.passengerService.findAll();
    }
    async findByFullNameSubstring(substring) {
        if (!substring) {
            throw new common_1.BadRequestException('Substring query parameter is required');
        }
        return await this.passengerService.findByFullNameSubstring(substring);
    }
    async findByUsername(username) {
        return await this.passengerService.findByUsername(username);
    }
    async findById(id) {
        return await this.passengerService.findById(id);
    }
    async update(id, updatePassengerDto) {
        return await this.passengerService.update(id, updatePassengerDto);
    }
    async removeByUsername(username) {
        return await this.passengerService.removeByUsername(username);
    }
    async remove(id) {
        const passenger = await this.passengerService.findById(id);
        return await this.passengerService.removeByUsername(passenger.username);
    }
    async uploadPhoto(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('Photo file is required and must be an image (jpg, jpeg, png, webp)');
        }
        return await this.passengerService.updatePhotoPath(id, file.filename);
    }
    getPhoto(filename, res) {
        res.sendFile(filename, { root: './uploads/photos' });
    }
    async getAvailableRoutes() {
        return await this.routeService.findActive();
    }
    async searchRoutes(startLocation, endLocation) {
        if (!startLocation && !endLocation) {
            return await this.routeService.findActive();
        }
        return await this.routeService.findByLocation(startLocation, endLocation);
    }
    async getRouteDetails(routeId) {
        return await this.routeService.findOne(routeId);
    }
    async getRouteSchedules(routeId) {
        return await this.scheduleService.findByRoute(routeId);
    }
    async getAvailableSchedules() {
        return await this.scheduleService.findAvailableForBooking();
    }
};
exports.PassengerController = PassengerController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/tickets'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "createTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/tickets/multiple'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_multiple_tickets_dto_1.CreateMultipleTicketsDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "createMultipleTickets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/tickets'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerTickets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/tickets/grouped'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerTicketsGrouped", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':passengerId/tickets/:ticketId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('ticketId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "cancelTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':passengerId/booking-groups/:bookingGroupId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('bookingGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "cancelBookingGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('tickets/:ticketId/status'),
    __param(0, (0, common_1.Param)('ticketId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_ticket_status_dto_1.UpdateTicketStatusDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "updateTicketStatus", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createPassenger_dto_1.CreatePassengerDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search/fullname'),
    __param(0, (0, common_1.Query)('substring')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "findByFullNameSubstring", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "findByUsername", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updatePassenger_dto_1.UpdatePassengerDto]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('username/:username'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "removeByUsername", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
                cb(null, true);
            }
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: {
            fileSize: 2 * 1024 * 1024
        },
        storage: (0, multer_2.diskStorage)({
            destination: './uploads/photos',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            },
        })
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Get)('photo/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Get)('routes/available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getAvailableRoutes", null);
__decorate([
    (0, common_1.Get)('routes/search'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "searchRoutes", null);
__decorate([
    (0, common_1.Get)('routes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getRouteDetails", null);
__decorate([
    (0, common_1.Get)('routes/:id/schedules'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getRouteSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getAvailableSchedules", null);
exports.PassengerController = PassengerController = __decorate([
    (0, common_1.Controller)('passenger'),
    __metadata("design:paramtypes", [passenger_service_1.PassengerService,
        route_service_1.RouteService,
        schedule_service_1.ScheduleService])
], PassengerController);
//# sourceMappingURL=passenger.controller.js.map