import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Passenger } from './entities/passenger.entities';
import { Ticket } from './entities/ticket.entity';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { UpdatePassengerDto } from './dto/updatePassenger.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMultipleTicketsDto } from './dto/create-multiple-tickets.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './services/email.service';
import { ScheduleService } from '../admin/services/schedule.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PassengerService {
    constructor(
        @InjectRepository(Passenger)
        private readonly passengerRepository: Repository<Passenger>,
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly scheduleService: ScheduleService
    ) {}

    // Create a user
    async create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
        try {
            // Check if username already exists
            const existingUser = await this.passengerRepository.findOne({
                where: { username: createPassengerDto.username }
            });

            if (existingUser) {
                throw new ConflictException(`Username '${createPassengerDto.username}' already exists`);
            }

            const passenger = this.passengerRepository.create({
                ...createPassengerDto,
                isActive: createPassengerDto.isActive ?? false // Default to false as per requirement
            });

            return await this.passengerRepository.save(passenger);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create passenger: ${error.message}`);
        }
    }

    // Retrieve users whose full name contains a specific substring
    async findByFullNameSubstring(substring: string): Promise<Passenger[]> {
        if (!substring || substring.trim() === '') {
            throw new Error('Search substring cannot be empty');
        }

        return await this.passengerRepository.find({
            where: {
                fullName: Like(`%${substring}%`)
            },
            order: {
                fullName: 'ASC'
            }
        });
    }

    // Retrieve a user based on their unique username
    async findByUsername(username: string): Promise<Passenger> {
        if (!username || username.trim() === '') {
            throw new Error('Username cannot be empty');
        }

        const passenger = await this.passengerRepository.findOne({
            where: { username }
        });

        if (!passenger) {
            throw new NotFoundException(`Passenger with username '${username}' not found`);
        }

        return passenger;
    }

    // Remove a user based on their unique username
    async removeByUsername(username: string): Promise<{ message: string }> {
        if (!username || username.trim() === '') {
            throw new Error('Username cannot be empty');
        }

        const passenger = await this.passengerRepository.findOne({
            where: { username }
        });

        if (!passenger) {
            throw new NotFoundException(`Passenger with username '${username}' not found`);
        }

        await this.passengerRepository.remove(passenger);
        return { message: `Passenger with username '${username}' has been deleted` };
    }

    // Additional utility methods
    async findAll(): Promise<Passenger[]> {
        return await this.passengerRepository.find({
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findById(id: number): Promise<Passenger> {
        const passenger = await this.passengerRepository.findOne({
            where: { id }
        });

        if (!passenger) {
            throw new NotFoundException(`Passenger with ID ${id} not found`);
        }

        return passenger;
    }

    async update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger> {
        const passenger = await this.findById(id);

        // Check if username is being updated and if it already exists
        if (updatePassengerDto.username && updatePassengerDto.username !== passenger.username) {
            const existingUser = await this.passengerRepository.findOne({
                where: { username: updatePassengerDto.username }
            });

            if (existingUser) {
                throw new ConflictException(`Username '${updatePassengerDto.username}' already exists`);
            }
        }

        Object.assign(passenger, updatePassengerDto);
        return await this.passengerRepository.save(passenger);
    }

    async updatePhotoPath(id: number, filename: string): Promise<Passenger> {
        const passenger = await this.findById(id);
        passenger.photoPath = filename;
        return await this.passengerRepository.save(passenger);
    }

    async login(loginDto: LoginDto) {
        const passenger = await this.passengerRepository.findOne({
            where: { username: loginDto.username }
        });

        if (!passenger) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await passenger.validatePassword(loginDto.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: passenger.username, sub: passenger.id };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            passenger: {
                id: passenger.id,
                username: passenger.username,
                fullName: passenger.fullName
            }
        };
    }

    // Ticket related methods
    async createTicket(passengerId: number, createTicketDto: CreateTicketDto): Promise<Ticket> {
        const passenger = await this.findById(passengerId);
        
        const ticket = this.ticketRepository.create({
            ...createTicketDto,
            passenger
        });

        const savedTicket = await this.ticketRepository.save(ticket);

        // Send confirmation email if passenger has email
        if (passenger.mail) {
            await this.emailService.sendTicketConfirmation(passenger.mail, {
                ticketId: savedTicket.id.toString(),
                journeyDate: savedTicket.journeyDate,
                destination: savedTicket.routeName,
                seatNumber: savedTicket.seatNumber,
            });
        }

        return savedTicket;
    }

    async createMultipleTickets(passengerId: number, createMultipleTicketsDto: CreateMultipleTicketsDto): Promise<Ticket[]> {
        const passenger = await this.findById(passengerId);
        
        // Validate schedule exists and has enough available seats
        const schedule = await this.scheduleService.findOne(createMultipleTicketsDto.scheduleId);
        
        if (createMultipleTicketsDto.seats.length > schedule.availableSeats) {
            throw new BadRequestException(
                `Not enough seats available. Requested: ${createMultipleTicketsDto.seats.length}, Available: ${schedule.availableSeats}`
            );
        }

        if (createMultipleTicketsDto.seats.length > 4) {
            throw new BadRequestException('Maximum 4 seats can be booked at once');
        }

        // Check if seat numbers are already taken
        const seatNumbers = createMultipleTicketsDto.seats.map(seat => seat.seatNumber);
        const existingTickets = await this.ticketRepository.find({
            where: {
                scheduleId: createMultipleTicketsDto.scheduleId,
                journeyDate: new Date(createMultipleTicketsDto.journeyDate),
                seatNumber: seatNumbers as any, // TypeORM will handle the IN query
                status: 'confirmed'
            }
        });

        if (existingTickets.length > 0) {
            const takenSeats = existingTickets.map(ticket => ticket.seatNumber);
            throw new BadRequestException(`Seats already booked: ${takenSeats.join(', ')}`);
        }

        // Generate unique booking group ID
        const bookingGroupId = uuidv4();

        // Create tickets for all seats
        const tickets: Ticket[] = [];
        
        for (const seatData of createMultipleTicketsDto.seats) {
            const ticket = this.ticketRepository.create({
                routeName: createMultipleTicketsDto.routeName,
                seatNumber: seatData.seatNumber,
                price: seatData.price,
                journeyDate: new Date(createMultipleTicketsDto.journeyDate),
                scheduleId: createMultipleTicketsDto.scheduleId,
                bookingGroupId: bookingGroupId,
                passenger: passenger,
                status: 'confirmed'
            });
            
            tickets.push(ticket);
        }

        const savedTickets = await this.ticketRepository.save(tickets);

        // Update schedule available seats
        schedule.availableSeats -= createMultipleTicketsDto.seats.length;
        await this.scheduleService.update(schedule.id, { availableSeats: schedule.availableSeats });

        // Send confirmation email if passenger has email
        if (passenger.mail) {
            const totalPrice = createMultipleTicketsDto.seats.reduce((sum, seat) => sum + seat.price, 0);
            await this.emailService.sendMultipleTicketConfirmation(passenger.mail, {
                bookingGroupId: bookingGroupId,
                tickets: savedTickets.map(ticket => ({
                    ticketId: ticket.id.toString(),
                    seatNumber: ticket.seatNumber,
                    price: ticket.price
                })),
                journeyDate: savedTickets[0].journeyDate,
                destination: savedTickets[0].routeName,
                totalPrice: totalPrice,
                seatCount: savedTickets.length
            });
        }

        return savedTickets;
    }

    async getPassengerTickets(passengerId: number): Promise<Ticket[]> {
        const passenger = await this.passengerRepository.findOne({
            where: { id: passengerId },
            relations: ['tickets']
        });

        if (!passenger) {
            throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
        }

        return passenger.tickets;
    }

    async getPassengerTicketsGrouped(passengerId: number): Promise<any> {
        const tickets = await this.ticketRepository.find({
            where: { passenger: { id: passengerId } },
            order: { createdAt: 'DESC' }
        });

        // Group tickets by booking group ID
        const groupedTickets = tickets.reduce((groups, ticket) => {
            const groupId = ticket.bookingGroupId || ticket.id.toString();
            if (!groups[groupId]) {
                groups[groupId] = {
                    bookingGroupId: groupId,
                    tickets: [],
                    totalSeats: 0,
                    totalPrice: 0,
                    journeyDate: ticket.journeyDate,
                    routeName: ticket.routeName,
                    status: ticket.status,
                    createdAt: ticket.createdAt
                };
            }
            groups[groupId].tickets.push(ticket);
            groups[groupId].totalSeats += 1;
            groups[groupId].totalPrice += ticket.price;
            return groups;
        }, {});

        return Object.values(groupedTickets);
    }

    async cancelBookingGroup(passengerId: number, bookingGroupId: string): Promise<Ticket[]> {
        // Find all tickets in the booking group for this passenger
        const tickets = await this.ticketRepository.find({
            where: { 
                passenger: { id: passengerId }, 
                bookingGroupId: bookingGroupId,
                status: 'confirmed'
            }
        });

        if (tickets.length === 0) {
            throw new NotFoundException(`No confirmed tickets found for booking group ${bookingGroupId}`);
        }

        // Update all tickets to cancelled status
        const cancelledTickets = await Promise.all(
            tickets.map(async (ticket) => {
                ticket.status = 'cancelled';
                return await this.ticketRepository.save(ticket);
            })
        );

        // Update schedule available seats (add back the cancelled seats)
        if (tickets[0].scheduleId) {
            const schedule = await this.scheduleService.findOne(tickets[0].scheduleId);
            schedule.availableSeats += tickets.length;
            await this.scheduleService.update(schedule.id, { availableSeats: schedule.availableSeats });
        }

        return cancelledTickets;
    }

    async cancelTicket(passengerId: number, ticketId: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, passenger: { id: passengerId } },
            relations: ['passenger']
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket not found or does not belong to passenger`);
        }

        ticket.status = 'cancelled';
        return await this.ticketRepository.save(ticket);
    }

    async updateTicketStatus(ticketId: number, status: string): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId },
            relations: ['passenger']
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
        }

        ticket.status = status;
        return await this.ticketRepository.save(ticket);
    }

    // Legacy methods for backward compatibility (if needed)
    getPassenger(): string {
        return 'Hello Nest Js';
    }

    getPassengerName(name: string): string {
        return `Hello Passenger ${name} !`;
    }
}


