import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetAppointmentsByClient {
  @ApiProperty({
    description: 'ID клієнта',
    example: 12,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'clientId має бути цілим числом' })
  @Min(1, { message: 'clientId має бути більше 0' })
  clientId: number;
}
