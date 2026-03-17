import { ApiProperty } from '@nestjs/swagger';
import { IWorker } from 'src/workers/entities/workers.interface';


export class LicenseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 91 })
  worker: IWorker;

  @ApiProperty({ example: '2026-03-17' })
  issue_date: Date;

  @ApiProperty({ example: 'Міністерство охорони здоровʼя' })
  issued_by: string;

  @ApiProperty({ example: 'LIC-2026-001' })
  number_license: string;

  @ApiProperty({ example: '2028-03-17' })
  expiration_date: Date;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-17T14:45:45.000Z' })
  updated_at: Date;
}
