import { Injectable } from '@nestjs/common';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkerShiftsService {
  constructor(
    @InjectRepository(WorkerShifts) private workerShiftsRepo: Repository<WorkerShifts>,
  ) {}

  findAll(): Promise<WorkerShifts[]> {
    return this.workerShiftsRepo.find({
  relations: ['worker', 'worker.specialty'],
});

  }
}
