import { Expose, Type } from 'class-transformer';
import { DentistryFullDto } from '@/dentistry/dto/Response/BaseType/DentistryFull.response.dto';
import { AppointmentActionFullDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionFull.response.dto';

export class OperationListFullDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Type(() => DentistryFullDto)
  @Expose()
  dental_clinic: DentistryFullDto;

  @Expose()
  active: boolean;

  @Type(() => AppointmentActionFullDto)
  @Expose()
  appointment_action?: AppointmentActionFullDto[];
}
