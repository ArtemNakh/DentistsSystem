import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateLicenseDto {
  @ApiProperty({ example: 91, description: 'ID працівника, якому видається ліцензія' })
  @IsNumber()
  workerId: number;

  @ApiProperty({ example: '2026-03-17', description: 'Дата видачі ліцензії' })
  @IsDateString()
  issue_date: Date;

  @ApiProperty({ example: 'Міністерство охорони здоровʼя', description: 'Орган, що видав ліцензію' })
  @IsString()
  issued_by: string;

  @ApiProperty({ example: 'LIC-2026-001', description: 'Номер ліцензії' })
  @IsString()
  number_license: string;

  @ApiProperty({ example: '2028-03-17', description: 'Дата закінчення дії ліцензії' })
  @IsDateString()
  expiration_date: Date;
}
