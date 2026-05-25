import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  MinLength,
  IsNotEmpty,
} from "class-validator";
import { BloodSign } from "../entities/client.interface";

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsDateString()
  birthdate: string;

  @IsOptional()
  @IsEnum(BloodSign)
  blood_resus: BloodSign;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  blood_group: number;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  allergic_diseases?: string;

  @IsOptional() // пароль може бути необов’язковим при оновленні
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must contain at least 6 characters" })
  @IsNotEmpty({ message: "Password cannot be empty" })
  password?: string;
}
