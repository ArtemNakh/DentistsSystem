import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { WorkerPublicDto } from '@/workers/dto/Response/BaseType/WorkersPublic.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SpecialtyPublicDto {
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

  @Type(() => WorkerPublicDto)
  @Expose()
  @ApiProperty({
    type: () => WorkerPublicDto,
    description: 'Працівник, який має цю спеціалізацію',
  })
  worker: WorkerPublicDto;
}
