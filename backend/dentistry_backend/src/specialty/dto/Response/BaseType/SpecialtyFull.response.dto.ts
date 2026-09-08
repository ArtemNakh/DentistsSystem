import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { WorkerFullDto } from '@/workers/dto/Response/BaseType/WorkersFull.response.dto';
import { Expose, Type } from 'class-transformer';

export class SpecialtyFullDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  type: SpecialtyType;

  @Type(() => WorkerFullDto)
  @Expose()
  worker: WorkerFullDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
