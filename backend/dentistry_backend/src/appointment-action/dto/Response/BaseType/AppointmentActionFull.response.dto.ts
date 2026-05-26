import { Expose, Type } from 'class-transformer';
import { AppointmentPublicDto } from '@/appointment/dto/Response/BaseType/AppointmentPublic.response.dto';
import { OperationListPublicDto } from '@/operation-list/dto/Response/BaseType/OperationListPublic.response.dto';

export class AppointmentActionFullDto {
  @Expose()
  id: number;

  @Type(() => AppointmentPublicDto)
  @Expose()
  appointment: AppointmentPublicDto;

  @Type(() => OperationListPublicDto)
  @Expose()
  operation: OperationListPublicDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
