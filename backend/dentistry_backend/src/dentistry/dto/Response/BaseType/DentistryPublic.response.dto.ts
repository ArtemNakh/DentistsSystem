import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';
import { Expose, Type } from 'class-transformer';
import { LicensePublicDto } from '@/license/dto/Response/BaseType/LicensePublic.response.dto';

export class DentistryPublicDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор стоматології' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Запоріжжя', description: 'Місто, де знаходиться стоматологія' })
  city: string;

  @Expose()
  @ApiProperty({ example: 'вул. Центральна, 12', description: 'Вулиця стоматології' })
  street: string;

  @Expose()
  @ApiProperty({ example: 'Запорізька область', description: 'Регіон стоматології' })
  region: string;

  @Type(() => SpecialtyPublicDto)
  @Expose()
  @ApiProperty({ type: () => SpecialtyPublicDto, description: 'Основна спеціалізація стоматології' })
  specialty: SpecialtyPublicDto;

  @Expose()
  @Type(() => DentistryPublicDto)
  @ApiProperty({ type: () => DentistryPublicDto, description: 'Пов’язана стоматологія (якщо є)' })
  dentistry: DentistryPublicDto;

  @Type(() => LicensePublicDto)
  @Expose()
  @ApiProperty({ type: () => [LicensePublicDto], description: 'Ліцензії стоматології' })
  licenses: LicensePublicDto[];
}
