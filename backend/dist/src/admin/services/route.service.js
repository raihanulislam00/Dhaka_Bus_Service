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
exports.RouteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const route_entity_1 = require("../entities/route.entity");
let RouteService = class RouteService {
    routeRepository;
    constructor(routeRepository) {
        this.routeRepository = routeRepository;
    }
    async create(createRouteDto) {
        const route = this.routeRepository.create(createRouteDto);
        return await this.routeRepository.save(route);
    }
    async findAll() {
        return await this.routeRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findActive() {
        return await this.routeRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const route = await this.routeRepository.findOne({ where: { id } });
        if (!route) {
            throw new common_1.NotFoundException(`Route with ID ${id} not found`);
        }
        return route;
    }
    async update(id, updateRouteDto) {
        await this.routeRepository.update(id, updateRouteDto);
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.routeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Route with ID ${id} not found`);
        }
    }
    async toggleActive(id) {
        const route = await this.findOne(id);
        route.isActive = !route.isActive;
        return await this.routeRepository.save(route);
    }
    async findByLocation(startLocation, endLocation) {
        const query = this.routeRepository.createQueryBuilder('route');
        if (startLocation) {
            query.andWhere('LOWER(route.startLocation) LIKE LOWER(:startLocation)', {
                startLocation: `%${startLocation}%`,
            });
        }
        if (endLocation) {
            query.andWhere('LOWER(route.endLocation) LIKE LOWER(:endLocation)', {
                endLocation: `%${endLocation}%`,
            });
        }
        return await query.getMany();
    }
};
exports.RouteService = RouteService;
exports.RouteService = RouteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(route_entity_1.RouteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RouteService);
//# sourceMappingURL=route.service.js.map