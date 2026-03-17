import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from 'src/workers/entities/workers.entity';
import { IWorker } from 'src/workers/entities/workers.interface';
import { CreateWorkerShiftDto } from './dto/CreateWorker-shift.dto';
@Injectable()
export class WorkerShiftsService {
  constructor(
    @InjectRepository(WorkerShifts)
    private workerShiftsRepo: Repository<WorkerShifts>,
    @InjectRepository(Worker)
    private readonly workerRepo: Repository<Worker>,
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

  /**
   * Отримати кількість неробочих днів для всіх лікарів у стоматології
   * @param dentistryId - стоматологія
   * @param startDate - початок періоду
   * @param endDate - кінець періоду
   */
  async getWorkersWeekendByDentistry(
    dentistryId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ worker: Worker; weekendDays: number }[]> {
    // Отримати всіх працівників стоматології
    const workers = await this.workerRepo.find({
      where: { dentistry: { id: dentistryId } },
      relations: ["specialty"],
    });

    const result: { worker: Worker; weekendDays: number }[] = [];

    for (const worker of workers) {
      // Отримати всі зміни цього працівника за період
      const shifts = await this.workerShiftsRepo.find({
        where: {
          worker: { id: worker.id },
          shift_date: Between(startDate, endDate),
        },
      });

      // Кількість календарних днів у періоді
      const totalDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

      // Унікальні дні, коли є зміни
      const workedDays = new Set(
        shifts.map((s) => {
          const date = new Date(s.shift_date); // привести до Date
          return date.toISOString().split('T')[0];
        }),
      ).size;

      // Вихідні = всі дні - робочі дні
      const weekendDays = totalDays - workedDays;

      result.push({ worker, weekendDays });
    }

    return result;
  }

  /**
   * Отримати кількість неробочих днів для конкретного лікаря
   */
  async getWeekendByWorker(
    workerId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ worker: Worker; weekendDays: number }> {
    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
      relations: ['specialty'],
    });
    if (!worker) {
      throw new Error(`Worker with id ${workerId} not found`);
    }

    const shifts = await this.workerShiftsRepo.find({
      where: {
        worker: { id: workerId },
        shift_date: Between(startDate, endDate),
      },
    });

    const totalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

    const workedDays = new Set(
      shifts.map((s) => {
        // shift_date може бути string або Date
        if (s.shift_date instanceof Date) {
          return s.shift_date.toISOString().split('T')[0];
        }
        return String(s.shift_date).split('T')[0]; // якщо це string
      }),
    ).size;

    const weekendDays = totalDays - workedDays;

    return { worker, weekendDays };
  }



  async createShift(dto: CreateWorkerShiftDto): Promise<WorkerShifts> {
    const worker = await this.workerRepo.findOne({ where: { id: dto.workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const shift = this.workerShiftsRepo.create({ ...dto, worker });
    return this.workerShiftsRepo.save(shift);
  }

  async removeShift(id: number): Promise<{ success: boolean; message: string }> {
    const shift = await this.workerShiftsRepo.findOne({ where: { id } });
    if (!shift) throw new NotFoundException('Shift not found');

    await this.workerShiftsRepo.remove(shift);
    return { success: true, message: `Shift with id ${id} has been deleted successfully` };
  }

  
}
