import { Module } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { WorkerShiftsController } from './worker-shifts.controller';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from 'src/workers/entities/workers.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WorkerShifts,Worker])],
  controllers: [WorkerShiftsController],
  providers: [WorkerShiftsService],
  exports:[WorkerShiftsService]
})
export class WorkerShiftsModule {}
