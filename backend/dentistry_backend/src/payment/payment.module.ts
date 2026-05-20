import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkersModule } from '@/workers/workers.module';
import { DentistryModule } from '@/dentistry/dentistry.module';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]),WorkersModule,DentistryModule,ClientsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
