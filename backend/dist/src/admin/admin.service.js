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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const admin_entity_1 = require("./entities/admin.entity");
let AdminService = class AdminService {
    adminRepository;
    jwtService;
    constructor(adminRepository, jwtService) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
    }
    async findAll() {
        return this.adminRepository.find();
    }
    async findOne(id) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} is not Found`);
        }
        return admin;
    }
    async create(createAdminData) {
        const newAdmin = new admin_entity_1.AdminEntity();
        Object.assign(newAdmin, createAdminData);
        return this.adminRepository.save(newAdmin);
    }
    async update(id, updateAdminData) {
        const adminToUpdate = await this.findOne(id);
        Object.assign(adminToUpdate, updateAdminData);
        return this.adminRepository.save(adminToUpdate);
    }
    async remove(id) {
        const adminToDelete = await this.findOne(id);
        await this.adminRepository.remove(adminToDelete);
    }
    async updateCountry(id, country) {
        const admin = await this.findOne(id);
        admin.country = country;
        return this.adminRepository.save(admin);
    }
    async findByJoiningDate(date) {
        return this.adminRepository
            .createQueryBuilder('admin')
            .where('DATE(admin.joiningDate) = :date', {
            date: date.toISOString().split('T')[0]
        })
            .getMany();
    }
    async findWithDefaultCountry() {
        return this.adminRepository.find({ where: { country: 'Unknown' } });
    }
    async updatePhotoPath(id, filename) {
        const admin = await this.findOne(id);
        admin.photoPath = filename;
        return this.adminRepository.save(admin);
    }
    async getPhotoPath(id) {
        const admin = await this.findOne(id);
        if (!admin.photoPath) {
            throw new common_1.NotFoundException('Photo not found for this admin');
        }
        return admin.photoPath;
    }
    async register(createAdminDto) {
        const existingAdmin = await this.adminRepository.findOne({
            where: { username: createAdminDto.username }
        });
        if (existingAdmin) {
            throw new common_1.ConflictException(`Username '${createAdminDto.username}' already exists`);
        }
        const admin = this.adminRepository.create(createAdminDto);
        return await this.adminRepository.save(admin);
    }
    async login(loginAdminDto) {
        const admin = await this.adminRepository.findOne({
            where: { username: loginAdminDto.username }
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await admin.validatePassword(loginAdminDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { username: admin.username, sub: admin.id, role: 'admin' };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            admin: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
                mail: admin.mail
            }
        };
    }
    async findByUsername(username) {
        const admin = await this.adminRepository.findOne({
            where: { username }
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with username '${username}' not found`);
        }
        return admin;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.AdminEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admin.service.js.map