    import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SpecialtyType } from '../entities/specialty.interface';



export class UpdateSpecialtyDto {
  @ApiProperty({ example: 'Терапевт', description: 'Назва спеціалізації', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Лікування карієсу', description: 'Опис спеціалізації', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: SpecialtyType.RECEPTION, description: 'Тип спеціалізації', enum: SpecialtyType, required: false })
  @IsOptional()
  @IsEnum(SpecialtyType)
  type?: SpecialtyType;
}
