import { Module } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { WorkerShiftsController } from './worker-shifts.controller';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([WorkerShifts])],
  controllers: [WorkerShiftsController],
  providers: [WorkerShiftsService],
  exports:[WorkerShiftsService]
})
export class WorkerShiftsModule {}
