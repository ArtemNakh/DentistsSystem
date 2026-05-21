import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchClientsQueryDto {
  @ApiProperty({
    description: 'Пошуковий рядок для пошуку клієнтів за ПІБ',
    example: 'Nathen Nader',
    required: false,
  })
  @IsString({ message: 'search має бути рядком' })
  search: string;
}
