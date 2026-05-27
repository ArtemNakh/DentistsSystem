import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WorkerShiftCommonDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор зміни',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: '2026-05-27',
    description: 'Дата зміни',
    type: String,
    format: 'date',
  })
  shift_date: Date;

  @Expose()
  @ApiProperty({
    example: '09:00:00',
    description: 'Час початку зміни (HH:mm:ss)',
  })
  start_time: string;

  @Expose()
  @ApiProperty({
    example: '17:00:00',
    description: 'Час завершення зміни (HH:mm:ss)',
  })
  end_time: string;
}
