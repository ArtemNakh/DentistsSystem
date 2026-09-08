import { IsString, IsDateString, IsNotEmpty, IsPhoneNumber, MinLength, IsNumber } from 'class-validator';

export class RegisterWorkerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  middle_name: string;

  @IsDateString()
  birthday: Date;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  specialtyId: number;

  @IsNumber()
  @IsNotEmpty()
  dentistryId: number;
}