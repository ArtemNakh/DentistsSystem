import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLicenseParamDto {
  @ApiProperty({
    description: 'ID ліцензії, яку потрібно оновити',
    example: 12,
  })
  @Type(() => Number)
  @IsInt({ message: 'id має бути цілим числом' })
  @Min(1, { message: 'id має бути більше 0' })
  id: number;
}
