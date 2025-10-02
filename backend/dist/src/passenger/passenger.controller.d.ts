import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMultipleTicketsDto } from './dto/create-multiple-tickets.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { LoginDto } from './dto/login.dto';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { UpdatePassengerDto } from './dto/updatePassenger.dto';
import { Passenger } from './entities/passenger.entities';
import { RouteService } from '../admin/services/route.service';
import { ScheduleService } from '../admin/services/schedule.service';
export declare class PassengerController {
    private readonly passengerService;
    private readonly routeService;
    private readonly scheduleService;
    constructor(passengerService: PassengerService, routeService: RouteService, scheduleService: ScheduleService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        passenger: {
            id: number;
            username: string;
            fullName: string;
        };
    }>;
    createTicket(passengerId: number, createTicketDto: CreateTicketDto): Promise<import("./entities/ticket.entity").Ticket>;
    createMultipleTickets(passengerId: number, createMultipleTicketsDto: CreateMultipleTicketsDto): Promise<import("./entities/ticket.entity").Ticket[]>;
    getPassengerTickets(passengerId: number): Promise<import("./entities/ticket.entity").Ticket[]>;
    getPassengerTicketsGrouped(passengerId: number): Promise<any>;
    cancelTicket(passengerId: number, ticketId: number): Promise<import("./entities/ticket.entity").Ticket>;
    cancelBookingGroup(passengerId: number, bookingGroupId: string): Promise<import("./entities/ticket.entity").Ticket[]>;
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
    getAvailableRoutes(): Promise<import("../admin/entities/route.entity").RouteEntity[]>;
    searchRoutes(startLocation?: string, endLocation?: string): Promise<import("../admin/entities/route.entity").RouteEntity[]>;
    getRouteDetails(routeId: number): Promise<import("../admin/entities/route.entity").RouteEntity>;
    getRouteSchedules(routeId: number): Promise<import("../admin/entities/schedule.entity").ScheduleEntity[]>;
    getAvailableSchedules(): Promise<import("../admin/entities/schedule.entity").ScheduleEntity[]>;
}
