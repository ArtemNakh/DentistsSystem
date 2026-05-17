import { ApiProperty } from '@nestjs/swagger';
import { Dentistry } from '@/dentistry/entities/dentistry.entity';
import { Specialty } from '@/specialty/entities/specialty.entity';

export class WorkerResponseDto {
  @ApiProperty({ example: 91 })
  id: number;

  @ApiProperty({ example: 'Іван' })
  name: string;

  @ApiProperty({ example: 'Петренко' })
  surname: string;

  @ApiProperty({ example: 'Іванович' })
  middle_name: string;

  @ApiProperty({ example: '1990-05-20' })
  birthday: Date;

  @ApiProperty({ example: '+380501234567' })
  phone: string;

  @ApiProperty({ type: () => Specialty })
  specialty: Specialty;

  @ApiProperty({ type: () => Dentistry })
  dentistry: Dentistry;

  @ApiProperty({ example: 'ivan.petrenko' })
  login: string;

  @ApiProperty({ example: 'securePassword123' })
  password: string;

  @ApiProperty({ example: '2026-03-17T15:09:39.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T15:09:39.000Z' })
  updated_at: Date;

  @ApiProperty({ example: true })
  active: boolean;
}
