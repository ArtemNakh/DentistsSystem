import { ApiProperty } from '@nestjs/swagger';
import { StatusAppointment } from '../entity/appointment.interface';
import { IsEnum } from 'class-validator';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'Новий статус запису',
    enum: StatusAppointment,
    example: StatusAppointment.CANCELLED,
  })
  @IsEnum(StatusAppointment, {
    message: 'Status must be one of: schedule, completed, wait_paid, cancelled',
  })
  status: StatusAppointment;
}
