import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteEntity } from '../entities/route.entity';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<RouteEntity> {
    const route = this.routeRepository.create(createRouteDto);
    return await this.routeRepository.save(route);
  }

  async findAll(): Promise<RouteEntity[]> {
    return await this.routeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<RouteEntity[]> {
    return await this.routeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RouteEntity> {
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async update(id: number, updateRouteDto: UpdateRouteDto): Promise<RouteEntity> {
    await this.routeRepository.update(id, updateRouteDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.routeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
  }

  async toggleActive(id: number): Promise<RouteEntity> {
    const route = await this.findOne(id);
    route.isActive = !route.isActive;
    return await this.routeRepository.save(route);
  }

  async findByLocation(startLocation?: string, endLocation?: string): Promise<RouteEntity[]> {
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
}