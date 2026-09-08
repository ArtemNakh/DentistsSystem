import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { AppointmentWithoutPaymentDto } from '@/appointment/dto/Response/partials/AppointmentWithoutPayment.response.dto';

export class GetPaymentsByWorkerResponseDto extends PaymentCommonDto {
  @ApiProperty({
    description: 'Запис у якої є оплата',
    type: AppointmentWithoutPaymentDto,
  })
  @ApiProperty({ type: () => AppointmentWithoutPaymentDto })
  @Type(() => AppointmentWithoutPaymentDto)
  @Expose()
  appointment: AppointmentWithoutPaymentDto;
}
