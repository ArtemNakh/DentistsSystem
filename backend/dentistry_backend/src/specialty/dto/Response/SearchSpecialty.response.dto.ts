import { WorkerWithDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkerWithDentistry.response.dto copy';
import { SpecialtyCommonDto } from './BaseType/SpecialtyCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SearchSpecialtyResponseDto extends SpecialtyCommonDto {
  @ApiProperty({
    description: 'Список дій, пов’язаних із прийомом',
    type: () => WorkerWithDentistryDto,
    isArray: true,
  })
  @Type(() => WorkerWithDentistryDto)
  @Expose()
  workers: WorkerWithDentistryDto[];
}
