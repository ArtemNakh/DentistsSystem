import { Expose, Type } from 'class-transformer';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';
import { WorkerPublicDto } from '@/workers/dto/Response/BaseType/WorkersPublic.response.dto';
import { ClientPublicDto } from '@/clients/dto/Response/BaseType/ClientPublic.response.dto';
import { PaymentPublicDto } from '@/payment/dto/Response/BaseType/PaymentPublic.response.dto';
import { AppointmentActionPublicDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionPublic.response.dto';

export class AppointmentFullDto {
  @Expose()
  id: number;

  @Type(() => ClientPublicDto)
  @Expose()
  client: ClientPublicDto;

  @Type(() => WorkerPublicDto)
  @Expose()
  dentist: WorkerPublicDto;

  @Expose()
  appointment_date: Date;

  @Expose()
  notes: string;

  @Expose()
  status: StatusAppointment;

  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;

  @Type(() => PaymentPublicDto)
  @Expose()
  payment: PaymentPublicDto;

  @Type(() => AppointmentActionPublicDto)
  @Expose()
  appointment_actions: AppointmentActionPublicDto[];
}
