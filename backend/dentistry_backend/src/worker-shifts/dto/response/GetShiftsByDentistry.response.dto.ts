import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { WorkerShiftCommonDto } from './BaseType/WorkerShiftCommon.response.dto';

export class GetShiftsByDentistryResponseDto extends WorkerShiftCommonDto {
  @ApiProperty({
    description: 'Працівник, у якого є розклад',
    type: WorkerCommonDto,
  })
  @ApiProperty({ type: () => WorkerCommonDto })
  @Type(() => WorkerCommonDto)
  @Expose()
  worker: WorkerCommonDto;
}
