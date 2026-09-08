import { Expose, Type } from 'class-transformer';
import { AppointmentPublicDto } from '@/appointment/dto/Response/BaseType/AppointmentPublic.response.dto';
import {
  MethodPayment,
  StatusPayment,
} from '@/payment/entity/payment.interface';

export class PaymentPublicDto {
  @Expose()
  id: number;

  @Type(() => AppointmentPublicDto)
  @Expose()
  appointment: AppointmentPublicDto;
  @Expose()
  amount: number;
  @Expose()
  status_paid: StatusPayment;
  @Expose()
  method_pay: MethodPayment;
  @Expose()
  payment_date: Date;
}
