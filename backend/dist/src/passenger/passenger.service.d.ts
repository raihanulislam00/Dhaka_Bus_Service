import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entities';
import { Ticket } from './entities/ticket.entity';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { UpdatePassengerDto } from './dto/updatePassenger.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './services/email.service';
export declare class PassengerService {
    private readonly passengerRepository;
    private readonly ticketRepository;
    private readonly jwtService;
    private readonly emailService;
    constructor(passengerRepository: Repository<Passenger>, ticketRepository: Repository<Ticket>, jwtService: JwtService, emailService: EmailService);
    create(createPassengerDto: CreatePassengerDto): Promise<Passenger>;
    findByFullNameSubstring(substring: string): Promise<Passenger[]>;
    findByUsername(username: string): Promise<Passenger>;
    removeByUsername(username: string): Promise<{
        message: string;
    }>;
    findAll(): Promise<Passenger[]>;
    findById(id: number): Promise<Passenger>;
    update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger>;
    updatePhotoPath(id: number, filename: string): Promise<Passenger>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        passenger: {
            id: number;
            username: string;
            fullName: string;
        };
    }>;
    createTicket(passengerId: number, createTicketDto: CreateTicketDto): Promise<Ticket>;
    getPassengerTickets(passengerId: number): Promise<Ticket[]>;
    cancelTicket(passengerId: number, ticketId: number): Promise<Ticket>;
    updateTicketStatus(ticketId: number, status: string): Promise<Ticket>;
    getPassenger(): string;
    getPassengerName(name: string): string;
}
