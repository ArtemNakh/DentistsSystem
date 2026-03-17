import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOperationDto {
  @ApiProperty({ example: 'Видалення зуба', description: 'Назва операції', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Хірургічне видалення зуба', description: 'Опис операції', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2000, description: 'Ціна операції', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}
