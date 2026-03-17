import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SpecialtyType } from '../entities/specialty.interface';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Хірург', description: 'Назва спеціалізації' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Оперативне лікування зубів', description: 'Опис спеціалізації', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: SpecialtyType.DOCTOR, description: 'Тип спеціалізації', enum: SpecialtyType })
  @IsEnum(SpecialtyType)
  type: SpecialtyType;
}
