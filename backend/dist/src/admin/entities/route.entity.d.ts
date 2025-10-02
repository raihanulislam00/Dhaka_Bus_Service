export declare class RouteEntity {
    id: number;
    name: string;
    startLocation: string;
    endLocation: string;
    stops: string;
    getStopsArray(): string[];
    setStopsArray(stopsArray: string[]): void;
    distance: number;
    estimatedDuration: number;
    fare: number;
    isActive: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
