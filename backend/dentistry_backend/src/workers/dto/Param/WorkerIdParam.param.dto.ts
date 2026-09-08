import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkerIdParamDto {
  @ApiProperty({
    description: 'ID працівника',
    example: 91,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'id must be an integer number' })
  @IsPositive({ message: 'id must be a positive number' })
  id: number;
}
