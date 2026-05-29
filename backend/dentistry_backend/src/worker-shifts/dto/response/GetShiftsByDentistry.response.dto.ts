import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { WorkerShiftCommonDto } from './BaseType/WorkerShiftCommon.response.dto';
import { WorkerWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersWithSpecialtyAndDentistry.response.dto';

export class GetShiftsByDentistryResponseDto extends WorkerShiftCommonDto {
  @ApiProperty({
    description: 'Працівник із повернення спеціалізації та стоматології',
    type: WorkerWithSpecialtyAndDentistryDto,
  })
  @ApiProperty({ type: () => WorkerWithSpecialtyAndDentistryDto })
  @Type(() => WorkerWithSpecialtyAndDentistryDto)
  @Expose()
  worker: WorkerWithSpecialtyAndDentistryDto;
}
