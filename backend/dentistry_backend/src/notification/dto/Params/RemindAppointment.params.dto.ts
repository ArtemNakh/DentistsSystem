import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class RemindAppointmentParamDto {
  @ApiProperty({
    description: 'ID стоматології, для якої потрібно відправити нагадування',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId має бути цілим числом' })
  @Min(1, { message: 'dentistryId має бути більше 0' })
  dentistryId: number;
}
