import { Ticket } from './ticket.entity';
export declare class Passenger {
    id: number;
    username: string;
    tickets: Ticket[];
    fullName: string;
    isActive: boolean;
    mail?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt?: Date;
    gender?: string;
    password?: string;
    photoPath?: string;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
