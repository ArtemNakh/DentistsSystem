import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetShifstsByWorkerParamDto {
  @ApiProperty({
    description: 'Ідентифікатор працівника',
    example: 1,
    type: Number,
    required: true,
  })
  @Type(() => Number) // трансформація з рядка у число
  @IsInt({ message: 'id must be an integer number' })
  @IsPositive({ message: 'id must be a positive number' })
  workerId: number;
}
