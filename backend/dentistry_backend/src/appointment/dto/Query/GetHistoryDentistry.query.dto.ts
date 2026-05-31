import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetHistoryDentistryDto {
  @ApiProperty({
    description: 'ID стоматології',
    example: 12,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId має бути цілим числом' })
  @Min(1, { message: 'dentistryId має бути більше 0' })
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
