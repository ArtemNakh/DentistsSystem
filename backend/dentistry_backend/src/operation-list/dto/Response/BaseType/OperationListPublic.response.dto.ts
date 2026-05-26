import { Expose, Type } from 'class-transformer';
import { AppointmentActionPublicDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionPublic.response.dto';
import { DentistryPublicDto } from '@/dentistry/dto/Response/BaseType/DentistryPublic.response.dto';

export class OperationListPublicDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Type(() => DentistryPublicDto)
  @Expose()
  dental_clinic: DentistryPublicDto;

  @Expose()
  active: boolean;

  @Type(() => AppointmentActionPublicDto)
  @Expose()
  appointment_action?: AppointmentActionPublicDto[];
}
