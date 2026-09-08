import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateOperationDto {
  @ApiProperty({ example: 'Видалення зуба', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Хірургічне видалення зуба', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2000, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: false, description: 'Флаг активності', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
