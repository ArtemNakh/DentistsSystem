import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';
import { AppointmentActionWithOperationDto } from '@/appointment-action/dto/Response/partialType/AppointmentActionWithOperation.response.dto';
import { WorkerWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersWithSpecialtyAndDentistry.response.dto';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';

export class AppointmentWithoutPaymentDto {
  @ApiProperty({
    description: 'Унікальний ідентифікатор запису',
    example: 1427,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Інформація про клієнта',
    type: () => ClientCommonDto,
  })
  @Type(() => ClientCommonDto)
  @Expose()
  client: ClientCommonDto;

  @ApiProperty({
    description: 'Інформація про стоматолога із спеціалізацією та клінікою',
    type: () => WorkerWithSpecialtyAndDentistryDto,
  })
  @Type(() => WorkerWithSpecialtyAndDentistryDto)
  @Expose()
  dentist: WorkerWithSpecialtyAndDentistryDto;

  @ApiProperty({
    description: 'Дата та час прийому',
    example: '2026-03-05T10:00:00.000Z',
  })
  @Expose()
  appointment_date: Date;

  @ApiProperty({
    description: 'Примітки до прийому',
    example: 'Біль при прийомі їжі',
  })
  @Expose()
  notes: string;

  @ApiProperty({
    description: 'Статус прийому',
    enum: StatusAppointment,
    example: 'schedule',
  })
  @Expose()
  status: StatusAppointment;

  @ApiProperty({
    description: 'Список дій, пов’язаних із прийомом',
    type: () => AppointmentActionWithOperationDto,
    isArray: true,
  })
  @Type(() => AppointmentActionWithOperationDto)
  @Expose()
  appointment_actions: AppointmentActionWithOperationDto[];
}
