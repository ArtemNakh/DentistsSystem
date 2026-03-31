import { Module } from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';
import { AppointmentActionController } from './appointment-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActions } from './entity/appointment-action.entity';
import { OperationList } from 'src/operation-list/entities/operation-list.entity';
import { Payment } from 'src/payment/entity/payment.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentActions,
      Appointment,
      OperationList,
      Payment,
    ]),
  ],
  controllers: [AppointmentActionController],
  providers: [AppointmentActionService],
  exports: [AppointmentActionService],
})
export class AppointmentActionModule {}
