export declare class RouteEntity {
    id: number;
    name: string;
    startLocation: string;
    endLocation: string;
    stops: string[];
    distance: number;
    estimatedDuration: number;
    fare: number;
    isActive: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
