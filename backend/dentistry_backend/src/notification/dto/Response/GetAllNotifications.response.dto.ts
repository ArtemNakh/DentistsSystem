import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { AppointmentActionWithOperationDto } from '@/appointment-action/dto/Response/partialType/AppointmentActionWithOperation.response.dto';
import { NotificationCommonDto } from './BaseType/NotiicationsCommon.response.dto';

export class GetAllNotificationsResponseDto extends NotificationCommonDto {
  @ApiProperty({
    description: 'Клієнт, який записан до зустрічі',
    type: ClientCommonDto,
  })
  @ApiProperty({ type: () => ClientCommonDto })
  @Type(() => ClientCommonDto)
  @Expose()
  client: ClientCommonDto;

  @ApiProperty({
    description: 'Працівник, у якого є розклад',
    type: WorkerCommonDto,
  })
  @ApiProperty({ type: () => WorkerCommonDto })
  @Type(() => WorkerCommonDto)
  @Expose()
  dentist: WorkerCommonDto;

  @ApiProperty({
    description: 'Дії які були зроблені',
    type: AppointmentActionWithOperationDto,
    isArray: true,
  })
  @ApiProperty({ type: () => AppointmentActionWithOperationDto })
  @Type(() => AppointmentActionWithOperationDto)
  @Expose()
  appointment_actions: AppointmentActionWithOperationDto[];

  @ApiProperty({
    description: 'Оплата за операцію',
    type: PaymentCommonDto,
  })
  @ApiProperty({ type: () => PaymentCommonDto })
  @Type(() => PaymentCommonDto)
  @Expose()
  payment: PaymentCommonDto;
}
