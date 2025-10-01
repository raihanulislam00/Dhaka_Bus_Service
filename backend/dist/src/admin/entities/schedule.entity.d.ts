import { RouteEntity } from './route.entity';
export declare class ScheduleEntity {
    id: number;
    routeId: number;
    route: RouteEntity;
    busNumber: string;
    departureTime: string;
    arrivalTime: string;
    dayOfWeek: string;
    totalSeats: number;
    availableSeats: number;
    isActive: boolean;
    notes: string;
    assignedDriverId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
