import { Expose, Type } from 'class-transformer';
import { BloodSign } from '@/clients/entities/client.interface';
import { AppointmentPublicDto } from '@/appointment/dto/Response/BaseType/AppointmentPublic.response.dto';

export class ClientPublicDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  middle_name: string;

  @Expose() birthdate: Date;

  @Expose() blood_resus: BloodSign;

  @Expose() blood_group: number;
  phone: string;

  @Expose() allergic_diseases: string;

  @Type(() => AppointmentPublicDto)
  @Expose()
  appointments: AppointmentPublicDto[];
}
