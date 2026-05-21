import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLicensesByDentistryParamDto {
  @ApiProperty({
    description: 'ID стоматології, для якої потрібно отримати ліцензії',
    example: 5,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId має бути цілим числом' })
  @Min(1, { message: 'dentistryId має бути більше 0' })
  dentistryId: number;
}
