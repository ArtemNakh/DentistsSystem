import { DentistryCommonDto } from '@/dentistry/dto/Response/BaseType/DentistryCommon.response.dto';
import { OperationListCommonDto } from './BaseType/OperationListCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UpdateOperationListResponseDto extends OperationListCommonDto {
  @ApiProperty({
    description: 'Стоматологія',
    type: DentistryCommonDto,
    isArray: true,
  })
  @ApiProperty({ type: () => DentistryCommonDto })
  @Type(() => DentistryCommonDto)
  @Expose()
  dental_clinic: DentistryCommonDto[];
}
