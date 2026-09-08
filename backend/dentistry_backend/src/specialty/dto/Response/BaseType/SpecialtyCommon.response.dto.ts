import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { Expose } from 'class-transformer';

export class SpecialtyCommonDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор спеціалізації' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Ортодонт', description: 'Назва спеціалізації' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Лікування неправильного прикусу та вирівнювання зубів',
    description: 'Опис спеціалізації',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({
    enum: SpecialtyType,
    example: SpecialtyType.DOCTOR,
    description: 'Тип спеціалізації (doctor, admin, reception)',
  })
  type: SpecialtyType;
}
