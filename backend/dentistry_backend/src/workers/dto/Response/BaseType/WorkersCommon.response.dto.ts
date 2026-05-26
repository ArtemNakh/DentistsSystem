import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WorkerCommonDto {
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
  @ApiProperty({ example: '1990-05-15', type: String, description: 'Дата народження працівника' })
  birthday: Date;

  @Expose()
  @ApiProperty({ example: '+380501234567', description: 'Номер телефону працівника' })
  phone: string;
}
