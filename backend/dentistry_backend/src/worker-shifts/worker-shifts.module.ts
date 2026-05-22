import { Module } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { WorkerShiftsController } from './worker-shifts.controller';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from '@/workers/entities/workers.entity';
import { WorkersModule } from '@/workers/workers.module';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkerShifts, Worker]),
    WorkersModule,
    ClientsModule,
  ],
  controllers: [WorkerShiftsController],
  providers: [WorkerShiftsService],
  exports: [WorkerShiftsService],
})
export class WorkerShiftsModule {}
