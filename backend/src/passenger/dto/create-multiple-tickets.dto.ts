import { IsString, IsNumber, IsDateString, IsArray, ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SeatBookingDto {
    @IsString()
    seatNumber: string;

    @IsNumber()
    price: number;
}

export class CreateMultipleTicketsDto {
    @IsString()
    routeName: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one seat must be selected' })
    @ArrayMaxSize(4, { message: 'Maximum 4 seats can be booked at once' })
    @ValidateNested({ each: true })
    @Type(() => SeatBookingDto)
    seats: SeatBookingDto[];

    @IsDateString()
    journeyDate: string;

    @IsNumber()
    scheduleId: number;
}