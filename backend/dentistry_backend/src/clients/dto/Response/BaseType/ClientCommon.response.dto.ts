import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BloodSign } from '@/clients/entities/client.interface';

export class ClientCommonDto {
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор клієнта',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Іван',
    description: 'Ім’я клієнта',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Петренко',
    description: 'Прізвище клієнта',
  })
  @Expose()
  surname: string;

  @ApiProperty({
    example: 'Іванович',
    description: 'По батькові клієнта (може бути необов’язковим)',
    required: false,
  })
  @Expose()
  middle_name: string;

  @ApiProperty({
    example: '2000-05-27',
    description: 'Дата народження клієнта (ISO‑рядок)',
    type: String,
  })
  @Expose()
  birthdate: Date;

  @ApiProperty({
    example: BloodSign.plus,
    enum: BloodSign,
    description: 'Резус‑фактор крові (plus/minus)',
  })
  @Expose()
  blood_resus: BloodSign;

  @ApiProperty({
    example: 2,
    description: 'Група крові (1–4)',
  })
  @Expose()
  blood_group: number;

  @ApiProperty({
    example: '+380681234567',
    description: 'Номер телефону клієнта',
  })
  @Expose()
  phone: string;

  @ApiProperty({
    example: 'Алергія на пилок',
    description: 'Алергічні захворювання (необов’язкове поле)',
    required: false,
  })
  @Expose()
  allergic_diseases: string;
}
