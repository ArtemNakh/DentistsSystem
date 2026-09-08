import { Expose } from 'class-transformer';
import {
  MethodPayment,
  StatusPayment,
} from '@/payment/entity/payment.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCommonDto {
  @Expose()
  @ApiProperty({
    example: 145,
    description: 'Унікальний ідентифікатор платежу',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 1200,
    description: 'Сума платежу у гривнях',
  })
  amount: number;

  @Expose()
  @ApiProperty({
    enum: StatusPayment,
    example: StatusPayment.PAID,
    description: 'Статус платежу (наприклад: PAID, WAIT_PAID, CANCELLED)',
  })
  status_paid: StatusPayment;

  @Expose()
  @ApiProperty({
    enum: MethodPayment,
    example: MethodPayment.CARD,
    description: 'Метод оплати (наприклад: CARD, CASH, TRANSFER)',
  })
  method_pay: MethodPayment;

  @Expose()
  @ApiProperty({
    example: '2026-05-27T11:08:01.000Z',
    description: 'Дата та час здійснення платежу',
    type: String,
    format: 'date-time',
  })
  payment_date: Date;
}
