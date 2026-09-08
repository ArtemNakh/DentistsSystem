import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';
import { Expose, Type } from 'class-transformer';
import { WorkerPublicDto } from '@/workers/dto/Response/BaseType/WorkersPublic.response.dto';

export class WorkerShiftPublicDto {
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
}
