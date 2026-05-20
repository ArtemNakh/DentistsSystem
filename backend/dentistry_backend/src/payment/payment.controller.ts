import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { Payment } from './entity/payment.entity';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('test/all')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('allByWorker')
    @UseInterceptors(ClassSerializerInterceptor)
  async getPaymentsByDentist(
    @Query('dentist') dentistId: number,
  ): Promise<Payment[]> {
    return this.paymentService.getPaymentsByDentist(dentistId);
  }

  @Get('allByDentistry')
    @UseInterceptors(ClassSerializerInterceptor)
  async getPaymentsByDentistry(
    @Query('dentistry') dentistryId: number,
  ): Promise<Payment[]> {
    return this.paymentService.getPaymentsByDentistry(dentistryId);
  }
}
