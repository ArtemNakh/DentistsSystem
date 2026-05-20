import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentsByDentistDto {
  @ApiProperty({
    type: Number,
    example: 12,
    description: 'Ідентифікатор лікаря (workerId)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  dentistId: number;
}
