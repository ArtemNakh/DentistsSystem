import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';

export class WorkerResponseDto {
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

  @ApiProperty({
    type: [Object],
    example: [
      {
        id: 101,
        issued_by: 'МОЗ України',
        issue_date: '2024-01-15',
        expiration_date: '2029-01-15',
      },
    ],
  })
  licenses?: {
    id: number;
    issued_by: string;
    issue_date: Date;
    number_license: string;
    expiration_date: Date;
    created_at: Date;
    updated_at: Date;
  }[];

  @ApiProperty({
    type: [Object],
    example: [
      {
        id: 12,
        date_shift: '2026-05-20',
        time_start: '08:00',
        time_end: '16:00',
      },
    ],
  })
  shifts?: {
    id: number;
    date_shift: Date;
    time_start: Date;
    time_end: Date;
    created_at: Date;
    updated_at: Date;
  }[];

  @ApiProperty({
    type: [Object],
    example: [
      {
        id: 1,
        appointment_date: '2026-05-14T08:00:00.000Z',
        notes: 'Пацієнт скаржиться на біль у зубі',
        status: 'wait_paid',
        created_at: '2024-07-18T12:02:10.000Z',
        updated_at: '2026-05-18T15:32:38.000Z',
      },
    ],
  })
  appointments?: {
    id: number;
    appointment_date: Date;
    notes: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  }[];

  @ApiProperty({ example: '2026-04-21T17:29:54.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-04-21T17:31:32.000Z' })
  updated_at: Date;
}
