import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SpecialtyPublicDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Стоматолог' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Лікує зуби та ясна', required: false })
  @Expose()
  description?: string;

  @ApiProperty({ example: SpecialtyType.DOCTOR, enum: SpecialtyType })
  @Expose()
  type: SpecialtyType;
}
