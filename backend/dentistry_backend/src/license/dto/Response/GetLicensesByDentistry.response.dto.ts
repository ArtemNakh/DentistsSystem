import { LicenseCommonDto } from './BaseType/LicenseCommon.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WorkerFullCommonWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersFullCommonWithSpecialtyAndDentistry.response.dto';

export class GetLicensesByDentistryResponseDto extends LicenseCommonDto {
  @ApiProperty({
    description: 'Працівник, якому видано ліцензію',
    type: WorkerFullCommonWithSpecialtyAndDentistryDto,
  })
  @ApiProperty({ type: () => WorkerFullCommonWithSpecialtyAndDentistryDto })
  @Type(() => WorkerFullCommonWithSpecialtyAndDentistryDto)
  @Expose()
  worker: WorkerFullCommonWithSpecialtyAndDentistryDto;
}
