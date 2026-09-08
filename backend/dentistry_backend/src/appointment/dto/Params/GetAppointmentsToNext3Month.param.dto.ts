import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetWorkerAppointmentsDto {
  @ApiProperty({
    description: 'Ідентифікатор працівника',
    example: 5,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'id має бути числом' })
  @Min(1, { message: 'id має бути більше 0' })
  workerId: number;
}
