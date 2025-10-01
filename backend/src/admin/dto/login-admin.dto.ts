import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}