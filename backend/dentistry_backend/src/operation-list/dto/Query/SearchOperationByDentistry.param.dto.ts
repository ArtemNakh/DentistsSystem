import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchOperationByDentistryQuery {
  @ApiProperty({
    description: 'Пошуковий рядок для фільтрації операцій',
    example: 'Видалення зуба',
    required: false,
  })
  @IsString({ message: 'search має бути рядком' })
  search: string;
}
