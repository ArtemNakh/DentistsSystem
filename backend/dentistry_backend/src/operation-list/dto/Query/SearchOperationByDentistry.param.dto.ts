import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchOperationByDentistryQuery {
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
    description: 'Пошуковий рядок для фільтрації операцій',
    example: 'Видалення зуба',
    required: false,
  })
  @IsString({ message: 'search має бути рядком' })
  search: string;
}
