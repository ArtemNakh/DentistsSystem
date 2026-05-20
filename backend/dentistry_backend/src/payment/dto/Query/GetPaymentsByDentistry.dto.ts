import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaymentsByDentistryDto {
  @ApiProperty({
    type: Number,
    example: 4,
    description: 'Ідентифікатор стоматології (dentistryId)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  dentistryId: number;
}
