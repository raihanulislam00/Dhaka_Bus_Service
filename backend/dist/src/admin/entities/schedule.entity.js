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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleEntity = void 0;
const typeorm_1 = require("typeorm");
const route_entity_1 = require("./route.entity");
let ScheduleEntity = class ScheduleEntity {
    id;
    routeId;
    route;
    busNumber;
    departureTime;
    arrivalTime;
    dayOfWeek;
    totalSeats;
    availableSeats;
    isActive;
    notes;
    assignedDriverId;
    createdAt;
    updatedAt;
};
exports.ScheduleEntity = ScheduleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => route_entity_1.RouteEntity),
    (0, typeorm_1.JoinColumn)({ name: 'routeId' }),
    __metadata("design:type", route_entity_1.RouteEntity)
], ScheduleEntity.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "busNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 45 }),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 45 }),
    __metadata("design:type", Number)
], ScheduleEntity.prototype, "availableSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ScheduleEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ScheduleEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Object)
], ScheduleEntity.prototype, "assignedDriverId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ScheduleEntity.prototype, "updatedAt", void 0);
exports.ScheduleEntity = ScheduleEntity = __decorate([
    (0, typeorm_1.Entity)('schedules')
], ScheduleEntity);
//# sourceMappingURL=schedule.entity.js.map