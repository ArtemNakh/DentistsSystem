import { Expose, Type } from 'class-transformer';
import { WorkerPublicDto } from '@/workers/dto/Response/BaseType/WorkersPublic.response.dto';

export class WorkerShiftFullDto {
  @Expose()
  id: number;

  @Expose()
  shift_date: Date;

  @Expose()
  start_time: string;

  @Expose()
  end_time: string;

  @Type(() => WorkerPublicDto)
  @Expose()
  worker: WorkerPublicDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
