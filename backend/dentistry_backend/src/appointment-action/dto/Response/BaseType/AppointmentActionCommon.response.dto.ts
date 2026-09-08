import { Expose, Type } from 'class-transformer';
import { OperationListCommonDto } from '@/operation-list/dto/Response/BaseType/OperationListCommon.response.dto';
import { AppointmentCommonDto } from '@/appointment/dto/Response/BaseType/AppointmentCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentActionCommonDto {
  @Expose()
  @ApiProperty({
    example: 101,
    description: 'Унікальний ідентифікатор дії у записі',
  })
  id: number;

  @Type(() => AppointmentCommonDto)
  @Expose()
  @ApiProperty({
    description: 'Запис (appointment), до якого належить дія',
    type: AppointmentCommonDto,
    example: {
      id: 12,
      appointment_date: '2026-03-31T21:00:00Z',
      notes: 'Планове лікування',
      status: 'WAIT_PAID',
    },
  })
  appointment: AppointmentCommonDto;

  @Type(() => OperationListCommonDto)
  @Expose()
  @ApiProperty({
    description: 'Список операцій, що виконуються у межах запису',
    type: OperationListCommonDto,
    example: [
      {
        id: 3,
        name: 'Пломбування',
        description: 'Лікування карієсу',
        price: 500,
      },
    ],
  })
  operation: OperationListCommonDto;
}
