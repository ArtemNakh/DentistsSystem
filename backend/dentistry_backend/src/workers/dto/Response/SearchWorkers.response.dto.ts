import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';
import { WorkerCommonDto } from './BaseType/WorkersCommon.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyCommonDto } from '@/specialty/dto/Response/BaseType/SpecialtyCommon.response.dto';
export class SearchWorkersResponseDto extends WorkerCommonDto {
  @Type(() => SpecialtyPublicDto)
  @Expose()
  @ApiProperty({
    type: () => SpecialtyCommonDto,
    description: 'Спеціалізація працівника',
  })
  specialty: SpecialtyCommonDto;

}
