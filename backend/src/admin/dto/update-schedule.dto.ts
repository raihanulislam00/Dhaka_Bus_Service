import { IsString, IsNumber, IsOptional, IsEnum, IsInt, MinLength, MaxLength, Min, Max } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  routeId?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  busNumber?: string;

  @IsOptional()
  @IsString()
  departureTime?: string;

  @IsOptional()
  @IsString()
  arrivalTime?: string;

  @IsOptional()
  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  dayOfWeek?: string;

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

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  availableSeats?: number;
}