import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

    @Get('test/all')
      findAll() {
        return this.paymentService.findAll();
      }
}
