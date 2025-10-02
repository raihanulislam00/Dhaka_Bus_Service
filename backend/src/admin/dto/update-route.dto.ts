import { IsString, IsArray, IsNumber, IsOptional, IsBoolean, MinLength, MaxLength, IsPositive, Min } from 'class-validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  startLocation?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  endLocation?: string;

  @IsOptional()
  @IsString()
  stops?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  distance?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedDuration?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fare?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}