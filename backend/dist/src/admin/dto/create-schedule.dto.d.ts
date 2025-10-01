export declare class CreateScheduleDto {
    routeId: number;
    busNumber: string;
    departureTime: string;
    arrivalTime: string;
    dayOfWeek: string;
    totalSeats?: number;
    notes?: string;
    assignedDriverId?: number;
}
