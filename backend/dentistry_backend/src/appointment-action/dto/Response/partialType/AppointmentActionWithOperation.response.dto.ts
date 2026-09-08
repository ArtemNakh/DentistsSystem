import { Expose, Type } from 'class-transformer';
import { OperationListCommonDto } from '@/operation-list/dto/Response/BaseType/OperationListCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentActionWithOperationDto {
  @Expose()
  @ApiProperty({
    example: 101,
    description: 'Унікальний ідентифікатор дії у записі',
  })
  id: number;

  @Type(() => OperationListCommonDto)
  @Expose()
  @ApiProperty({
    description: 'Список операцій, що виконуються у межах запису',
    type: OperationListCommonDto,
    example: {
      id: 3,
      name: 'Пломбування',
      description: 'Лікування карієсу',
      price: 500,
    },
  })
  operation: OperationListCommonDto;
}
