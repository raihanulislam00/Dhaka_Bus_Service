import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
export declare class AdminService {
    private adminRepository;
    private readonly jwtService;
    constructor(adminRepository: Repository<AdminEntity>, jwtService: JwtService);
    findAll(): Promise<AdminEntity[]>;
    findOne(id: number): Promise<AdminEntity>;
    create(createAdminData: CreateAdminDto): Promise<AdminEntity>;
    update(id: number, updateAdminData: UpdateAdminDto): Promise<AdminEntity>;
    remove(id: number): Promise<void>;
    updateCountry(id: number, country: string): Promise<AdminEntity>;
    findByJoiningDate(date: Date): Promise<AdminEntity[]>;
    findWithDefaultCountry(): Promise<AdminEntity[]>;
    updatePhotoPath(id: number, filename: string): Promise<AdminEntity>;
    getPhotoPath(id: number): Promise<string>;
    register(createAdminDto: CreateAdminDto): Promise<AdminEntity>;
    login(loginAdminDto: LoginAdminDto): Promise<{
        access_token: string;
        admin: {
            id: number;
            username: string;
            name: string;
            mail: string;
        };
    }>;
    findByUsername(username: string): Promise<AdminEntity>;
}
