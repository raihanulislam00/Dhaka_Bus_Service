export declare class CreateRouteDto {
    name: string;
    startLocation: string;
    endLocation: string;
    stops: string;
    distance: number;
    estimatedDuration: number;
    fare: number;
    isActive?: boolean;
    description?: string;
}
