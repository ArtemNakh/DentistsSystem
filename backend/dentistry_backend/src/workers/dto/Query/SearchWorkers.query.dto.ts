import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchWorkersQueryDto {
  @ApiProperty({
    description: 'Рядок пошуку (повне ім’я або його частина)',
    example: 'Іван Петренко',
    type: String,
    required: true,
  })
  @IsString()
  search: string;

  @ApiProperty({
    description: 'Ідентифікатор стоматології',
    example: 1,
    type: Number,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId must be an integer number' })
  @IsPositive({ message: 'dentistryId must be a positive number' })
  dentistryId: number;
}
