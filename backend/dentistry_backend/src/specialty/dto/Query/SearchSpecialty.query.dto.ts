import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, Length } from 'class-validator';

export class SearchDentistryQueryDto {
  @ApiProperty({
    description: 'Рядок пошуку за назвою спеціалізації',
    example: 'Київ',
    required:false,
  })
  @IsOptional()
  @IsString({ message: 'search має бути рядком' })
  @Length(2, 50, { message: 'search має містити від 2 до 50 символів' })
  search?: string;

  @ApiProperty({
    description: 'ID стоматології для фільтрації',
    example: 12,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistry має бути цілим числом' })
  @Min(1, { message: 'dentistry має бути більше 0' })
  dentistryId: number;
}
