import { WorkerWithSpecialtyDto } from '@/workers/dto/Response/BaseType/partials/WorkerWithSpecialty.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetWorkersWeekendResponseDto {
  @ApiProperty({
    description: 'Працівник стоматології',
    type: WorkerWithSpecialtyDto,
  })
  @ApiProperty({ type: () => WorkerWithSpecialtyDto })
  @Type(() => WorkerWithSpecialtyDto)
  @Expose()
  worker: WorkerWithSpecialtyDto;

  @ApiProperty({
    description: 'Кількість неробочихз днів',
    example: '5',
    type: 'number',
  })
  @Expose()
  weekendDays: number;
}
