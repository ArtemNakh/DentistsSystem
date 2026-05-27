import { LicenseCommonDto } from './BaseType/LicenseCommon.response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';

export class GetExpirationLicensesToDentistryResponseDto extends LicenseCommonDto {
  @ApiProperty({
    description: 'Працівник, якому видано ліцензію',
    type: WorkerCommonDto,
  })
  @ApiProperty({ type: () => WorkerCommonDto })
  @Type(() => WorkerCommonDto)
  @Expose()
  worker: WorkerCommonDto;
}
