import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateLicenseDto {
  @ApiProperty({ example: '2026-03-17', description: 'Дата видачі ліцензії', required: false })
  @IsOptional()
  @IsDateString()
  issue_date?: Date;

  @ApiProperty({ example: 'Міністерство охорони здоровʼя', description: 'Орган, що видав ліцензію', required: false })
  @IsOptional()
  @IsString()
  issued_by?: string;

  @ApiProperty({ example: 'LIC-2026-001', description: 'Номер ліцензії', required: false })
  @IsOptional()
  @IsString()
  number_license?: string;

  @ApiProperty({ example: '2028-03-17', description: 'Дата закінчення дії ліцензії', required: false })
  @IsOptional()
  @IsDateString()
  expiration_date?: Date;
}
