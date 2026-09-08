import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';

export class AppointmentCommonDto {
  @Expose()
  @ApiProperty({ example: 1427, description: 'Унікальний ідентифікатор прийому' })
  id: number;

  @Expose()
  @ApiProperty({
    example: '2026-03-05T10:30:00.000Z',
    type: String,
    format: 'date-time',
    description: 'Дата та час прийому',
  })
  appointment_date: Date;

  @Expose()
  @ApiProperty({
    example: 'Біль при прийомі їжі',
    description: 'Нотатки або коментарі до прийому',
  })
  notes: string;

  @Expose()
  @ApiProperty({
    enum: StatusAppointment,
    example: StatusAppointment.SCHEDULE,
    description: 'Статус прийому (наприклад: schedule, completed, canceled)',
  })
  status: StatusAppointment;
}
