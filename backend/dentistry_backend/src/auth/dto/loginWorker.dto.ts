import { IsString, IsNotEmpty } from 'class-validator';

export class LoginWorkerDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
