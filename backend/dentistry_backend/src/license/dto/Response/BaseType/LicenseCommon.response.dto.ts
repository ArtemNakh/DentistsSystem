import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LicenseCommonDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '1990-05-15' })
  @Expose()
  issue_date: Date;

  @ApiProperty({ example: 'Ministry of Health' })
  @Expose()
  issued_by: string;

  @ApiProperty({ example: 'GRY123ACD' })
  @Expose()
  number_license: string;

  @ApiProperty({ example: '1990-06-15' })
  @Expose()
  expiration_date: Date;
}
