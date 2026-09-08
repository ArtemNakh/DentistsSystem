import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWeekendsByWorkerParamDto {
  @ApiProperty({
    description: 'ID стоматології',
    example: 5,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  workerId: number;
}
