import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDriverDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}