import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CompletePaymentParams {
  @ApiProperty({
    description: 'ID записи',
    example: 12,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'appointmentId має бути цілим числом' })
  @Min(1, { message: 'appointmentId має бути більше 0' })
  appointmentId: number;

}
