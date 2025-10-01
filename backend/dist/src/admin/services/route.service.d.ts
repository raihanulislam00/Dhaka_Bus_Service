import { Repository } from 'typeorm';
import { RouteEntity } from '../entities/route.entity';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
export declare class RouteService {
    private readonly routeRepository;
    constructor(routeRepository: Repository<RouteEntity>);
    create(createRouteDto: CreateRouteDto): Promise<RouteEntity>;
    findAll(): Promise<RouteEntity[]>;
    findActive(): Promise<RouteEntity[]>;
    findOne(id: number): Promise<RouteEntity>;
    update(id: number, updateRouteDto: UpdateRouteDto): Promise<RouteEntity>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<RouteEntity>;
    findByLocation(startLocation?: string, endLocation?: string): Promise<RouteEntity[]>;
}
