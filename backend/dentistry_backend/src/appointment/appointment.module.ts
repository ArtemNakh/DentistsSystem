import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { Worker } from '@/workers/entities/workers.entity';
import { NotificationModule } from '@/notification/notification.module';
import { EmailModule } from '@/libs/email/email.module';
import { DentistryModule } from '@/dentistry/dentistry.module';
import { WorkersModule } from '@/workers/workers.module';
import { ClientsModule } from '@/clients/clients.module';
import { WorkerShifts } from '@/worker-shifts/entities/worker-shifts.entity';
import { WorkerShiftsModule } from '@/worker-shifts/worker-shifts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Worker, WorkerShifts]),
    NotificationModule,
    WorkersModule,
    DentistryModule,
    ClientsModule,
    WorkerShiftsModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
