import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '../../../specialty/entities/specialty.entity';
import { Dentistry } from '../../../dentistry/entities/dentistry.entity';
import { License } from '../../../license/entities/license.entity';
import { SpecialtyPublicDto } from '@/specialty/dto/Response/SpecialtyPublic.response.dto';
import { Expose, Type } from 'class-transformer';
import { LicensePublicDto } from '@/license/dto/Response/LicensePublic.response.dto';

export class WorkerPublicDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Іван' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Петренко' })
  @Expose()
  surname: string;

  @ApiProperty({ example: 'Олегович' })
  @Expose()
  middle_name: string;

  @ApiProperty({ example: '1990-05-15' })
  @Expose()
  birthday: Date;

  @ApiProperty({ type: () => SpecialtyPublicDto })
  @Type(() => SpecialtyPublicDto)
  @Expose()
  specialty: SpecialtyPublicDto;

  @ApiProperty({ type: () => Dentistry })
  @Expose()
  dentistry: Dentistry;

  @ApiProperty({ type: () => [LicensePublicDto] })
  @Type(() => LicensePublicDto)
  @Expose()
  licenses: LicensePublicDto[];
}
