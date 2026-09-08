import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLicensesByWorkerParamDto {
  @ApiProperty({
    description: 'ID працівника, для якого потрібно отримати ліцензії',
    example: 91,
  })
  @Type(() => Number)
  @IsInt({ message: 'workerId має бути цілим числом' })
  @Min(1, { message: 'workerId має бути більше 0' })
  workerId: number;
}
