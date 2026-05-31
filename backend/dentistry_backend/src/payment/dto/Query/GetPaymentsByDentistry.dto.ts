import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
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

  @ApiProperty({
    description: 'Кількість записів для отримання (take)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'take має бути цілим числом' })
  @Min(1, { message: 'take має бути більше 0' })
  take?: number;

  @ApiProperty({
    description: 'Кількість записів для пропуску (skip)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'skip має бути цілим числом' })
  @Min(0, { message: 'skip має бути більше або дорівнювати 0' })
  skip?: number;
}
