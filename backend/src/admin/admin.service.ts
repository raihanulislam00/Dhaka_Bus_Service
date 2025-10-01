import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) 
    private adminRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<AdminEntity[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} is not Found`);
    }
    return admin;
  }

  async create(createAdminData: CreateAdminDto): Promise<AdminEntity> {
    const newAdmin = new AdminEntity();
    Object.assign(newAdmin, createAdminData);
    return this.adminRepository.save(newAdmin);
  }

  async update(id: number, updateAdminData: UpdateAdminDto): Promise<AdminEntity> {
    const adminToUpdate = await this.findOne(id);
    Object.assign(adminToUpdate, updateAdminData);
    return this.adminRepository.save(adminToUpdate);
  }

  async remove(id: number): Promise<void> {
    const adminToDelete = await this.findOne(id);
    await this.adminRepository.remove(adminToDelete);
  }

  async updateCountry(id: number, country: string): Promise<AdminEntity> {
    const admin = await this.findOne(id);
    admin.country = country;
    return this.adminRepository.save(admin);
  }

  async findByJoiningDate(date: Date): Promise<AdminEntity[]> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .where('DATE(admin.joiningDate) = :date', { 
        date: date.toISOString().split('T')[0] 
      })
      .getMany();
  }

  async findWithDefaultCountry(): Promise<AdminEntity[]> {
    return this.adminRepository.find({ where: { country: 'Unknown' } });
  }

  async updatePhotoPath(id: number, filename: string): Promise<AdminEntity> {
    const admin = await this.findOne(id);
    admin.photoPath = filename;
    return this.adminRepository.save(admin);
  }

  async getPhotoPath(id: number): Promise<string> {
    const admin = await this.findOne(id);
    if (!admin.photoPath) {
      throw new NotFoundException('Photo not found for this admin');
    }
    return admin.photoPath;
  }

  // Authentication methods
  async register(createAdminDto: CreateAdminDto): Promise<AdminEntity> {
    // Check if username already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { username: createAdminDto.username }
    });

    if (existingAdmin) {
      throw new ConflictException(`Username '${createAdminDto.username}' already exists`);
    }

    const admin = this.adminRepository.create(createAdminDto);
    return await this.adminRepository.save(admin);
  }

  async login(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { username: loginAdminDto.username }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await admin.validatePassword(loginAdminDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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

  async findByUsername(username: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { username }
    });

    if (!admin) {
      throw new NotFoundException(`Admin with username '${username}' not found`);
    }

    return admin;
  }
}