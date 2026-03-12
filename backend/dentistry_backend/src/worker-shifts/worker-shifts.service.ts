import { Injectable } from '@nestjs/common';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkerShiftsService {
  constructor(
    @InjectRepository(WorkerShifts)
    private workerShiftsRepo: Repository<WorkerShifts>,
  ) {}

  findAll(): Promise<WorkerShifts[]> {
    return this.workerShiftsRepo.find({
      relations: ['worker', 'worker.specialty'],
    });
  }

  // Отримати розклад на 3 місяці наперед
  async findShiftsForWorker(workerId: number): Promise<WorkerShifts[]> {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    return this.workerShiftsRepo.find({
      where: {
        worker: { id: workerId },
        shift_date: Between(now, threeMonthsLater),
      },
      relations: ['worker', 'worker.specialty'],
      order: { shift_date: 'ASC' },
    });
  }
}
