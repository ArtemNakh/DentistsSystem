import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';


export class SpecialtyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Хірург' })
  name: string;

  @ApiProperty({ example: 'Оперативне лікування зубів' })
  description?: string;

  @ApiProperty({ example: SpecialtyType.DOCTOR, enum: SpecialtyType })
  type: SpecialtyType;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  updated_at: Date;
}
