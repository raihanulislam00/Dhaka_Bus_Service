"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passenger_entities_1 = require("./entities/passenger.entities");
const ticket_entity_1 = require("./entities/ticket.entity");
const jwt_1 = require("@nestjs/jwt");
const email_service_1 = require("./services/email.service");
const schedule_service_1 = require("../admin/services/schedule.service");
const uuid_1 = require("uuid");
let PassengerService = class PassengerService {
    passengerRepository;
    ticketRepository;
    jwtService;
    emailService;
    scheduleService;
    constructor(passengerRepository, ticketRepository, jwtService, emailService, scheduleService) {
        this.passengerRepository = passengerRepository;
        this.ticketRepository = ticketRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.scheduleService = scheduleService;
    }
    async create(createPassengerDto) {
        try {
            const existingUser = await this.passengerRepository.findOne({
                where: { username: createPassengerDto.username }
            });
            if (existingUser) {
                throw new common_1.ConflictException(`Username '${createPassengerDto.username}' already exists`);
            }
            const passenger = this.passengerRepository.create({
                ...createPassengerDto,
                isActive: createPassengerDto.isActive ?? false
            });
            return await this.passengerRepository.save(passenger);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create passenger: ${error.message}`);
        }
    }
    async findByFullNameSubstring(substring) {
        if (!substring || substring.trim() === '') {
            throw new Error('Search substring cannot be empty');
        }
        return await this.passengerRepository.find({
            where: {
                fullName: (0, typeorm_2.Like)(`%${substring}%`)
            },
            order: {
                fullName: 'ASC'
            }
        });
    }
    async findByUsername(username) {
        if (!username || username.trim() === '') {
            throw new Error('Username cannot be empty');
        }
        const passenger = await this.passengerRepository.findOne({
            where: { username }
        });
        if (!passenger) {
            throw new common_1.NotFoundException(`Passenger with username '${username}' not found`);
        }
        return passenger;
    }
    async removeByUsername(username) {
        if (!username || username.trim() === '') {
            throw new Error('Username cannot be empty');
        }
        const passenger = await this.passengerRepository.findOne({
            where: { username }
        });
        if (!passenger) {
            throw new common_1.NotFoundException(`Passenger with username '${username}' not found`);
        }
        await this.passengerRepository.remove(passenger);
        return { message: `Passenger with username '${username}' has been deleted` };
    }
    async findAll() {
        return await this.passengerRepository.find({
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async findById(id) {
        const passenger = await this.passengerRepository.findOne({
            where: { id }
        });
        if (!passenger) {
            throw new common_1.NotFoundException(`Passenger with ID ${id} not found`);
        }
        return passenger;
    }
    async update(id, updatePassengerDto) {
        const passenger = await this.findById(id);
        if (updatePassengerDto.username && updatePassengerDto.username !== passenger.username) {
            const existingUser = await this.passengerRepository.findOne({
                where: { username: updatePassengerDto.username }
            });
            if (existingUser) {
                throw new common_1.ConflictException(`Username '${updatePassengerDto.username}' already exists`);
            }
        }
        Object.assign(passenger, updatePassengerDto);
        return await this.passengerRepository.save(passenger);
    }
    async updatePhotoPath(id, filename) {
        const passenger = await this.findById(id);
        passenger.photoPath = filename;
        return await this.passengerRepository.save(passenger);
    }
    async login(loginDto) {
        const passenger = await this.passengerRepository.findOne({
            where: { username: loginDto.username }
        });
        if (!passenger) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await passenger.validatePassword(loginDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async createTicket(passengerId, createTicketDto) {
        const passenger = await this.findById(passengerId);
        const ticket = this.ticketRepository.create({
            ...createTicketDto,
            passenger
        });
        const savedTicket = await this.ticketRepository.save(ticket);
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
    async createMultipleTickets(passengerId, createMultipleTicketsDto) {
        const passenger = await this.findById(passengerId);
        const schedule = await this.scheduleService.findOne(createMultipleTicketsDto.scheduleId);
        if (createMultipleTicketsDto.seats.length > schedule.availableSeats) {
            throw new common_1.BadRequestException(`Not enough seats available. Requested: ${createMultipleTicketsDto.seats.length}, Available: ${schedule.availableSeats}`);
        }
        if (createMultipleTicketsDto.seats.length > 4) {
            throw new common_1.BadRequestException('Maximum 4 seats can be booked at once');
        }
        const seatNumbers = createMultipleTicketsDto.seats.map(seat => seat.seatNumber);
        const existingTickets = await this.ticketRepository.find({
            where: {
                scheduleId: createMultipleTicketsDto.scheduleId,
                journeyDate: new Date(createMultipleTicketsDto.journeyDate),
                seatNumber: seatNumbers,
                status: 'confirmed'
            }
        });
        if (existingTickets.length > 0) {
            const takenSeats = existingTickets.map(ticket => ticket.seatNumber);
            throw new common_1.BadRequestException(`Seats already booked: ${takenSeats.join(', ')}`);
        }
        const bookingGroupId = (0, uuid_1.v4)();
        const tickets = [];
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
        schedule.availableSeats -= createMultipleTicketsDto.seats.length;
        await this.scheduleService.update(schedule.id, { availableSeats: schedule.availableSeats });
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
    async getPassengerTickets(passengerId) {
        const passenger = await this.passengerRepository.findOne({
            where: { id: passengerId },
            relations: ['tickets']
        });
        if (!passenger) {
            throw new common_1.NotFoundException(`Passenger with ID ${passengerId} not found`);
        }
        return passenger.tickets;
    }
    async getPassengerTicketsGrouped(passengerId) {
        const tickets = await this.ticketRepository.find({
            where: { passenger: { id: passengerId } },
            order: { createdAt: 'DESC' }
        });
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
    async cancelBookingGroup(passengerId, bookingGroupId) {
        const tickets = await this.ticketRepository.find({
            where: {
                passenger: { id: passengerId },
                bookingGroupId: bookingGroupId,
                status: 'confirmed'
            }
        });
        if (tickets.length === 0) {
            throw new common_1.NotFoundException(`No confirmed tickets found for booking group ${bookingGroupId}`);
        }
        const cancelledTickets = await Promise.all(tickets.map(async (ticket) => {
            ticket.status = 'cancelled';
            return await this.ticketRepository.save(ticket);
        }));
        if (tickets[0].scheduleId) {
            const schedule = await this.scheduleService.findOne(tickets[0].scheduleId);
            schedule.availableSeats += tickets.length;
            await this.scheduleService.update(schedule.id, { availableSeats: schedule.availableSeats });
        }
        return cancelledTickets;
    }
    async cancelTicket(passengerId, ticketId) {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, passenger: { id: passengerId } },
            relations: ['passenger']
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket not found or does not belong to passenger`);
        }
        ticket.status = 'cancelled';
        return await this.ticketRepository.save(ticket);
    }
    async updateTicketStatus(ticketId, status) {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId },
            relations: ['passenger']
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${ticketId} not found`);
        }
        ticket.status = status;
        return await this.ticketRepository.save(ticket);
    }
    getPassenger() {
        return 'Hello Nest Js';
    }
    getPassengerName(name) {
        return `Hello Passenger ${name} !`;
    }
};
exports.PassengerService = PassengerService;
exports.PassengerService = PassengerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passenger_entities_1.Passenger)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService,
        schedule_service_1.ScheduleService])
], PassengerService);
//# sourceMappingURL=passenger.service.js.map