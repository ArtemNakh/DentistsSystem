import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetAppointmentsDentistryDto {
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
