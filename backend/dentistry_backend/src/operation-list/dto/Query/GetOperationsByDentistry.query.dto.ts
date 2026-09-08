import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class GetOperationsByDentistryQueryDto {
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

   @ApiProperty({
    description: 'Фільтр по активності операцій',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'active має бути булевим значенням' })
  active?: boolean;
}
