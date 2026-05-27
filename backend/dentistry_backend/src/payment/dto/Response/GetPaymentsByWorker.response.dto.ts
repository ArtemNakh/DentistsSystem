import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { AppointmentCommonDto } from '@/appointment/dto/Response/BaseType/AppointmentCommon.response.dto';

export class GetPaymentsByWorkerResponseDto extends PaymentCommonDto {
  @ApiProperty({
    description: 'Запис у якої є оплата',
    type: AppointmentCommonDto,
  })
  @ApiProperty({ type: () => AppointmentCommonDto })
  @Type(() => AppointmentCommonDto)
  @Expose()
  appointment:AppointmentCommonDto;

}
