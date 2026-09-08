import { LicenseCommonDto } from './BaseType/LicenseCommon.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WorkerWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersWithSpecialtyAndDentistry.response.dto';

export class GetExpirationLicensesToDentistryResponseDto extends LicenseCommonDto {
  @ApiProperty({
    description: 'Працівник, якому видано ліцензію',
    type: WorkerWithSpecialtyAndDentistryDto,
  })
  @ApiProperty({ type: () => WorkerWithSpecialtyAndDentistryDto })
  @Type(() => WorkerWithSpecialtyAndDentistryDto)
  @Expose()
  worker: WorkerWithSpecialtyAndDentistryDto;
}
