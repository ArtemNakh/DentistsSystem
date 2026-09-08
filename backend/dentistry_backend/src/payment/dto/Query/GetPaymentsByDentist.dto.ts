import { IsNumber, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
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
      description: `Кількість об'єктів для пропуску (skip)`,
      example: 0,
      required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'skip має бути цілим числом' })
    @Min(0, { message: 'skip має бути більше або дорівнювати 0' })
    skip?: number;
}
