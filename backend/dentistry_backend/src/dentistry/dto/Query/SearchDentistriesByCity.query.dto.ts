import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchDentistryDto {
  @ApiProperty({
    description: 'Назва міста для пошуку стоматологій',
    example: 'Київ',
    required: false,
  })
  @IsString({ message: 'search must be a string' })
  city: string;
}
