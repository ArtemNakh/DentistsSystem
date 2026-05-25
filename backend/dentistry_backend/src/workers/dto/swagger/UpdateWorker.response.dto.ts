import { ApiProperty } from '@nestjs/swagger';
import { Dentistry } from '@/dentistry/entities/dentistry.entity';
import { Specialty } from '@/specialty/entities/specialty.entity';


export class WorkerUpdateResponseDto {
  @ApiProperty({ example: 91 })
  id: number;

  @ApiProperty({ example: 'Іва1н' })
  name: string;

  @ApiProperty({ example: 'Петренко1' })
  surname: string;

  @ApiProperty({ example: 'Іванов1ич' })
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

  @ApiProperty({ example: '2026-03-17T15:18:01.000Z' })
  updated_at: Date;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 1 })
  specialtyId: number;

  @ApiProperty({ example: 2 })
  dentistryId: number;
}
