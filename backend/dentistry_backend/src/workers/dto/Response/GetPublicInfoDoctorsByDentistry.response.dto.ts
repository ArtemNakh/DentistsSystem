import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';
import { WorkerCommonDto } from './BaseType/WorkersCommon.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyCommonDto } from '@/specialty/dto/Response/BaseType/SpecialtyCommon.response.dto';
import { LicenseCommonDto } from '@/license/dto/Response/BaseType/LicenseCommon.response.dto';

export class GetPublicInfoDoctorsByDentistry extends WorkerCommonDto {
  @Type(() => SpecialtyPublicDto)
  @Expose()
  @ApiProperty({
    type: () => SpecialtyCommonDto,
    description: 'Спеціалізація працівника',
  })
  specialty: SpecialtyCommonDto;

  @Type(() => LicenseCommonDto)
  @Expose()
  @ApiProperty({
    type: () => LicenseCommonDto,
    description: 'Ліцензії лікаря',isArray:true
  })
  licenses: LicenseCommonDto[];
}
