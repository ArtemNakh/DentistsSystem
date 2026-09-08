import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetWeekendByWorkerResponseDto {
  @ApiProperty({
    description: 'Працівник, у якого є розклад',
    type: WorkerCommonDto,
  })
  @ApiProperty({ type: () => WorkerCommonDto })
  @Type(() => WorkerCommonDto)
  @Expose()
  worker: WorkerCommonDto;

  @ApiProperty({
    description: 'Кількість неробочихз днів',
    example: '5',
    type: 'number',
  })
  @Expose()
  weekendDays: number;
}
