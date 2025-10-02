import { IsString, IsArray, IsNumber, IsOptional, IsBoolean, MinLength, MaxLength, IsPositive, Min } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  startLocation: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  endLocation: string;

  @IsString()
  stops: string;

  @IsNumber()
  @IsPositive()
  distance: number;

  @IsNumber()
  @Min(1)
  estimatedDuration: number;

  @IsNumber()
  @IsPositive()
  fare: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}