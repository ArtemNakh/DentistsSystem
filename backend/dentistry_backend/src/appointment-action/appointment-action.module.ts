import { Module } from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';
import { AppointmentActionController } from './appointment-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActions } from './entity/appointment-action.entity';
import { OperationList } from '@/operation-list/entities/operation-list.entity';
import { Payment } from '@/payment/entity/payment.entity';
import { Appointment } from '@/appointment/entity/appointment.entity';
import { WorkersModule } from '@/workers/workers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentActions,
      Appointment,
      OperationList,
      Payment,
    ]),
    WorkersModule,
  ],
  controllers: [AppointmentActionController],
  providers: [AppointmentActionService],
  exports: [AppointmentActionService],
})
export class AppointmentActionModule {}
