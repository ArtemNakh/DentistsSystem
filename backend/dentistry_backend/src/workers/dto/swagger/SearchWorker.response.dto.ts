import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';

export class SearchWorkerResponseDto {
  @ApiProperty({ example: 65 })
  id: number;

  @ApiProperty({ example: 'Іван' })
  name: string;

  @ApiProperty({ example: 'Олегович' })
  middle_name: string;

  @ApiProperty({ example: 'Петренко' })
  surname: string;

  @ApiProperty({ example: '1990-05-15' })
  birthday: Date;

  @ApiProperty({ example: '+380671234567' })
  phone: string;

  @ApiProperty({
    example: {
      id: 2,
      name: 'Orthodontist',
      description:
        'Спеціаліст з діагностики та лікування неправильного прикусу',
      type: 'doctor',
      created_at: '2026-04-08T15:20:33.000Z',
      updated_at: '2026-05-11T15:33:18.000Z',
    },
  })
  specialty: {
    id: number;
    name: string;
    description?: string;
    type: SpecialtyType;
    created_at: Date;
    updated_at: Date;
  };

  @ApiProperty({
    example: {
      id: 1,
      street: '55438 Heaney Island',
      city: 'Beckerworth',
      region: 'Florida',
      created_at: '2026-04-08T15:20:33.000Z',
      updated_at: '2026-04-08T15:20:33.000Z',
    },
  })
  dentistry: {
    id: number;
    street: string;
    city: string;
    region: string;
    created_at: Date;
    updated_at: Date;
  };

  @ApiProperty({ example: 'ivan.petrenko' })
  login: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2026-04-21T17:29:54.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-04-21T17:31:32.000Z' })
  updated_at: Date;
}
