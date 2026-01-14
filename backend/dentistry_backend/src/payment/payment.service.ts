import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { IPayment } from './entity/payment.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  findAll(): Promise<IPayment[]> {
    return this.paymentRepo.find({ relations: ['appointment'] });
  }
}
