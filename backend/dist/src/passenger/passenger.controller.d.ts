import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { LoginDto } from './dto/login.dto';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { UpdatePassengerDto } from './dto/updatePassenger.dto';
import { Passenger } from './entities/passenger.entities';
export declare class PassengerController {
    private readonly passengerService;
    constructor(passengerService: PassengerService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        passenger: {
            id: number;
            username: string;
            fullName: string;
        };
    }>;
    createTicket(passengerId: number, createTicketDto: CreateTicketDto): Promise<import("./entities/ticket.entity").Ticket>;
    getPassengerTickets(passengerId: number): Promise<import("./entities/ticket.entity").Ticket[]>;
    cancelTicket(passengerId: number, ticketId: number): Promise<import("./entities/ticket.entity").Ticket>;
    updateTicketStatus(ticketId: number, updateTicketStatusDto: UpdateTicketStatusDto): Promise<import("./entities/ticket.entity").Ticket>;
    create(createPassengerDto: CreatePassengerDto): Promise<Passenger>;
    findAll(): Promise<Passenger[]>;
    findByFullNameSubstring(substring: string): Promise<Passenger[]>;
    findByUsername(username: string): Promise<Passenger>;
    findById(id: number): Promise<Passenger>;
    update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger>;
    removeByUsername(username: string): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    uploadPhoto(id: number, file: any): Promise<Passenger>;
    getPhoto(filename: string, res: any): void;
}
