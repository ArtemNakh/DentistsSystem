import { Module } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { WorkerShiftsController } from './worker-shifts.controller';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from '@/workers/entities/workers.entity';
import { WorkersModule } from '@/workers/workers.module';
import { ClientsModule } from '@/clients/clients.module';
import { AppointmentModule } from '@/appointment/appointment.module';
import { Appointment } from '@/appointment/entity/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkerShifts, Worker,Appointment]),
    WorkersModule,
    ClientsModule,
  ],
  controllers: [WorkerShiftsController],
  providers: [WorkerShiftsService],
  exports: [WorkerShiftsService],
})
export class WorkerShiftsModule {}
