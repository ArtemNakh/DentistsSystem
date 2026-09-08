import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWorkersByDentistryQuery {
  @ApiProperty({
    description: 'Ідентифікатор стоматології',
    example: 1,
    type: Number,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId must be an integer number' })
  @IsPositive({ message: 'dentistryId must be a positive number' })
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
