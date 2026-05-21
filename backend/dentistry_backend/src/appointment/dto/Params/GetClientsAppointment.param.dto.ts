import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetClientsAppointmentParamDto {
  @ApiProperty({
    description: 'Ідентифікатор запису (appointment)',
    example: 1427,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'appointmentId має бути числом' })
  @Min(1, { message: 'appointmentId має бути більше 0' })
  appointmentId: number;
}
