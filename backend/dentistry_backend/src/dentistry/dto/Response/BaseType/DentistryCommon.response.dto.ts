import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DentistryCommonDto {
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
}
