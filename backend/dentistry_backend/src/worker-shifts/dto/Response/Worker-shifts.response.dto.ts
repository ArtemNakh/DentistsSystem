import { ApiProperty } from '@nestjs/swagger';
import { IWorker } from '@/workers/entities/workers.interface';

export class WorkerShiftResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 91 })
  worker: IWorker   ;

  @ApiProperty({ example: '2026-03-18' })
  shift_date: Date;

  @ApiProperty({ example: '09:00:00' })
  start_time: string;

  @ApiProperty({ example: '17:00:00' })
  end_time: string;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  updated_at: Date;
}
