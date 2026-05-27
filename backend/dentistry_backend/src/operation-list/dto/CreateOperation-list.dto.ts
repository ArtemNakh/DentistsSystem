import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({ example: 'Видалення зуба' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Хірургічне видалення зуба' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: true, description: 'Флаг активності' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
