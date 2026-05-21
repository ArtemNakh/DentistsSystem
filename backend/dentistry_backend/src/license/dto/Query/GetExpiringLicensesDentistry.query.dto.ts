import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetExpiringLicensesDentistryQueryDto {
  @ApiProperty({
    description: 'ID лікаря (обовʼязковий параметр)',
    example: 5,
  })
  @Type(() => Number)
  @IsInt({ message: 'workerId має бути цілим числом' })
  @Min(1, { message: 'workerId має бути більше 0' })
  dentistryId: number;

  @ApiProperty({
    description: 'Максимальний діапазон у днях (обовʼязковий параметр)',
    example: 30,
  })
  @Type(() => Number)
  @IsInt({ message: 'maxDays має бути цілим числом' })
  @Min(1, { message: 'maxDays має бути більше 0' })
  maxDays: number;
}
