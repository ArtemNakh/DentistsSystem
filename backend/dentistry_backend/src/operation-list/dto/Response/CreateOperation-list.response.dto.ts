import { ApiProperty } from '@nestjs/swagger';
import { IDentistry } from 'src/dentistry/entities/dentistry.interface';


export class OperationResponseDto    {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Видалення зуба' })
  name: string;

  @ApiProperty({ example: 'Хірургічне видалення зуба' })
  description: string;

  @ApiProperty({ example: 1500 })
  price: number;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  updated_at: Date;

  
  @ApiProperty({ type: () => Object,example:"1", description: 'Стоматологія, до якої належить операція' })
  dental_clinic: IDentistry;
}
