import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchClientsQueryDto {
  @ApiProperty({
    description: 'Пошуковий рядок для пошуку клієнтів за ПІБ',
    example: 'Nathen Nader',
    required: false,
  })
  @IsString({ message: 'fio має бути рядком' })
  fio: string;
}
