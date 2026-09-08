import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';
import { Expose, Type } from 'class-transformer';
import { LicensePublicDto } from '@/license/dto/Response/BaseType/LicensePublic.response.dto';
import { DentistryPublicDto } from '@/dentistry/dto/Response/BaseType/DentistryPublic.response.dto';

export class WorkerPublicDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор працівника' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Іван', description: 'Імʼя працівника' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Петренко', description: 'Прізвище працівника' })
  surname: string;

  @Expose()
  @ApiProperty({ example: 'Олегович', description: 'По батькові працівника' })
  middle_name: string;

  @Expose()
  @ApiProperty({ example: '1990-05-15', type: String, description: 'Дата народження' })
  birthday: Date;

  @Type(() => SpecialtyPublicDto)
  @Expose()
  @ApiProperty({ type: () => SpecialtyPublicDto, description: 'Спеціалізація працівника' })
  specialty: SpecialtyPublicDto;

  @Type(() => DentistryPublicDto)
  @Expose()
  @ApiProperty({ type: () => DentistryPublicDto, description: 'Стоматологія, де працює працівник' })
  dentistry: DentistryPublicDto;

  @Type(() => LicensePublicDto)
  @Expose()
  @ApiProperty({ type: () => [LicensePublicDto], description: 'Ліцензії працівника' })
  licenses: LicensePublicDto[];
}
