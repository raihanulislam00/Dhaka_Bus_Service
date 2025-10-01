import { Passenger } from './passenger.entities';
export declare class Ticket {
    id: number;
    routeName: string;
    seatNumber: string;
    price: number;
    journeyDate: Date;
    status: string;
    passenger: Passenger;
    createdAt: Date;
    updatedAt: Date;
}
