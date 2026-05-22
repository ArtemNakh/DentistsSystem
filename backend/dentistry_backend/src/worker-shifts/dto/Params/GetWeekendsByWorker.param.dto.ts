import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetWeekendsByWorkerQueryDto {
  @ApiProperty({
    description: 'Дата початку періоду',
    example: '2026-05-22',
    required: false,
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    description: 'Дата завершення періоду',
    example: '2026-05-29',
    required: false,
  })
  @IsDateString()
  end: string;
}
