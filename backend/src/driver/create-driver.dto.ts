import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  Min,
  Max,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(18, { message: 'Age must be at least 18' })
  @Max(70, { message: 'Age must not exceed 70' })
  age: number;

  @IsOptional()
  nidImage?: string;
}
