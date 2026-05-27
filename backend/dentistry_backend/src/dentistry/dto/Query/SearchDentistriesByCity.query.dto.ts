import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SearchDentistryQueryDto {
  @ApiProperty({
    description: 'Назва міста для пошуку стоматологій',
    example: 'Київ',
    required: true,
  })
  @IsString({ message: 'city must be a string' })
  @MinLength(2, { message: 'City must contain at least 2 characters' })
  city: string;
}
