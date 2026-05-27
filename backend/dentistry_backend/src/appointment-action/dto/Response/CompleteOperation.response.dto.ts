import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentActionWithOperationDto } from './partialType/AppointmentActionWithOperation.response.dto';
import { AppointmentCommonDto } from '@/appointment/dto/Response/BaseType/AppointmentCommon.response.dto';

export class CompleteOperationResponseDto {
  @ApiProperty({
    description: 'Запис до якої додається виконання',
    type: AppointmentCommonDto,
  })
  @ApiProperty({ type: () => AppointmentCommonDto })
  @Type(() => AppointmentCommonDto)
  @Expose()
  appointment: AppointmentCommonDto;

  @ApiProperty({
    description: 'Дії які були зроблені',
    type: AppointmentActionWithOperationDto,
    isArray: true,
  })
  @ApiProperty({ type: () => AppointmentActionWithOperationDto })
  @Type(() => AppointmentActionWithOperationDto)
  @Expose()
  actions: AppointmentActionWithOperationDto[];

  @ApiProperty({
    description: 'Оплата за операцію',
    type: PaymentCommonDto,
  })
  @ApiProperty({ type: () => PaymentCommonDto })
  @Type(() => PaymentCommonDto)
  @Expose()
  payment: PaymentCommonDto;
}
