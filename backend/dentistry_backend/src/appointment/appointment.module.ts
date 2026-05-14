import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { Worker } from 'src/workers/entities/workers.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { EmailModule } from 'src/libs/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Worker]),
    NotificationModule,
    EmailModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
