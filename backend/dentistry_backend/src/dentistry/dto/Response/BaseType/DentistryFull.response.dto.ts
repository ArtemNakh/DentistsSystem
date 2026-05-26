import { Expose, Type } from 'class-transformer';
import { WorkerFullDto } from '@/workers/dto/Response/BaseType/WorkersFull.response.dto';
import { OperationListFullDto } from '@/operation-list/dto/Response/BaseType/OperationListFull.response.dto';

export class DentistryFullDto {
  @Expose()
  id: number;
  @Expose()
  city: string;
  @Expose()
  street: string;
  @Expose()
  region: string;

  is_active: boolean;
  @Type(() => WorkerFullDto)
  @Expose()
  worker: WorkerFullDto;

  @Expose()
  @Type(() => OperationListFullDto)
  operation_lists: OperationListFullDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
