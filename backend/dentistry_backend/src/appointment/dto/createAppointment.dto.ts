import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 12, description: 'ID клієнта' })
  @IsNotEmpty()
  clientId: number;
  @ApiProperty({ example: 5, description: 'ID стоматолога' })
  @IsNotEmpty()
  dentistId: number;
  @ApiProperty({
    example: '2026-03-05T10:00:00',
    description: 'Дата та час прийому',
  })
  @IsDateString()
  appointment_date: Date;
  @ApiProperty({
    example: ' Біль при прийомі їжі',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
