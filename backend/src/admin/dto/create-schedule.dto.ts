import { IsString, IsNumber, IsOptional, IsEnum, IsInt, MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  @IsInt()
  routeId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  busNumber: string;

  @IsString()
  departureTime: string; // Format: HH:MM

  @IsString()
  arrivalTime: string; // Format: HH:MM

  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  dayOfWeek: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(60)
  totalSeats?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  assignedDriverId?: number;
}