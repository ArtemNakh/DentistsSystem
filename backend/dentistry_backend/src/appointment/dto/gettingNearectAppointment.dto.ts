import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-04-01' })
  appointment_date: string;

  @ApiProperty({ example: 'Консультація' })
  notes: string;

  @ApiProperty({ example: 'completed' })
  status: string;

  @ApiProperty({
    example: {
      id: 10,
      surname: 'Петренко',
      name: 'Іван',
      middle_name: 'Сергійович',
    },
  })
  client: any;

  @ApiProperty({
    example: {
      id: 5,
      surname: 'Дмитренко',
      name: 'Микола',
      middle_name: 'Іванович',
    },
  })
  dentist: any;
}
