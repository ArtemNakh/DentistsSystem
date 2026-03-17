import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateWorkerShiftDto {
  @ApiProperty({ example: 91, description: 'ID працівника' })
  @IsNumber()
  workerId: number;

  @ApiProperty({ example: '2026-03-18', description: 'Дата зміни' })
  @IsDateString()
  shift_date: Date;

  @ApiProperty({ example: '09:00:00', description: 'Час початку зміни (HH:mm:ss)' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: '17:00:00', description: 'Час завершення зміни (HH:mm:ss)' })
  @IsString()
  end_time: string;
}


