import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, Min, IsOptional } from 'class-validator';

export class GetNearestDto {
  @ApiProperty({
    description: 'Дата для пошуку сповіщень (ISO формат)',
    example: '2026-05-21',
    required: false,
  })
  @IsDateString({}, { message: 'date має бути коректною датою у форматі ISO' })
  date: string;

  @ApiProperty({
    description: 'ID стоматології',
    example: 12,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId має бути цілим числом' })
  @Min(1, { message: 'dentistryId має бути більше 0' })
  dentistryId: number;
}
