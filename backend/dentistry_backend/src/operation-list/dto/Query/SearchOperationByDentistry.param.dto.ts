import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchOperationByDentistryQuery {
  @ApiProperty({
    description: 'Пошуковий рядок для фільтрації операцій',
    example: 'Видалення зуба',
    required: false,
  })
  @IsString({ message: 'search має бути рядком' })
  search: string;

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
