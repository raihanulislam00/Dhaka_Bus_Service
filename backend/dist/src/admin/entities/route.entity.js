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
exports.RouteEntity = void 0;
const typeorm_1 = require("typeorm");
let RouteEntity = class RouteEntity {
    id;
    name;
    startLocation;
    endLocation;
    stops;
    getStopsArray() {
        try {
            return JSON.parse(this.stops);
        }
        catch {
            return [];
        }
    }
    setStopsArray(stopsArray) {
        this.stops = JSON.stringify(stopsArray);
    }
    distance;
    estimatedDuration;
    fare;
    isActive;
    description;
    createdAt;
    updatedAt;
};
exports.RouteEntity = RouteEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RouteEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RouteEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RouteEntity.prototype, "startLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], RouteEntity.prototype, "endLocation", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], RouteEntity.prototype, "stops", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], RouteEntity.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], RouteEntity.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], RouteEntity.prototype, "fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RouteEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], RouteEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RouteEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RouteEntity.prototype, "updatedAt", void 0);
exports.RouteEntity = RouteEntity = __decorate([
    (0, typeorm_1.Entity)('routes')
], RouteEntity);
//# sourceMappingURL=route.entity.js.map