import { ApiProperty } from '@nestjs/swagger';

export class DentistryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Київ' })
  city: string;

  @ApiProperty({ example: '296 Ethel shoals' })
  street: string;

  @ApiProperty({ example: 'Utah' })
  region: string;

  @ApiProperty({ example: 'true' })
  is_active: boolean;

  @ApiProperty({ example: '2026-03-17T15:09:39.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T15:18:01.000Z' })
  updated_at: Date;
}
