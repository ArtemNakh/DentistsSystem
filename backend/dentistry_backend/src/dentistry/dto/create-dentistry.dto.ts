import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDentistryDto {
  @ApiProperty({
    example: 'Main Street 12',
    description: 'Вулиця, де знаходиться стоматологія',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Berlin',
    description: 'Місто, де розташована стоматологія',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Mitte',
    description: 'Регіон або район міста',
  })
  @IsString()
  @IsNotEmpty()
  region: string;
}
