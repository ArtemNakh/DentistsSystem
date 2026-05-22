import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '@/workers/entities/workers.entity';
import { CreateWorkerShiftDto } from './dto/CreateWorker-shift.dto';
import { IWorkerShifts } from './entities/worker-shifts.interface';
import { WorkersService } from '@/workers/workers.service';
@Injectable()
export class WorkerShiftsService {
  constructor(
    @InjectRepository(WorkerShifts)
    private workerShiftsRepo: Repository<WorkerShifts>,
    @InjectRepository(Worker)
    private readonly workerRepo: Repository<Worker>,

    private readonly workerService: WorkersService,
  ) {}

  findAll(): Promise<WorkerShifts[]> {
    return this.workerShiftsRepo.find({
      relations: ['worker', 'worker.specialty'],
    });
  }

  // Отримати розклад на 3 місяці наперед
  async findShiftsForWorker(workerId: number): Promise<WorkerShifts[]> {
    await this.workerService.findById(workerId);

    return this.workerShiftsRepo.find({
      where: {
        worker: { id: workerId },
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
      relations: ['specialty'],
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
    const worker = await this.workerRepo.findOne({
      where: { id: dto.workerId },
    });
    if (!worker) throw new NotFoundException('Worker not found');

    // Перевірка на існування такого ж графіку
    const existingShift = await this.workerShiftsRepo.findOne({
      where: {
        worker: { id: dto.workerId },
        shift_date: dto.shift_date,
        start_time: dto.start_time,
        end_time: dto.end_time,
      },
    });

    if (existingShift) {
      throw new ConflictException(
        `Shift for worker ${dto.workerId} on ${dto.shift_date} from ${dto.start_time} to ${dto.end_time} already exists`,
      );
    }
    const shift = this.workerShiftsRepo.create({ ...dto, worker });
    return this.workerShiftsRepo.save(shift);
  }

  async removeShift(
    shiftId: number,
  ): Promise<{ success: boolean; message: string }> {
    const shift = await this.workerShiftsRepo.findOne({
      where: { id: shiftId },
    });
    if (!shift) throw new NotFoundException('Shift not found');

    await this.workerShiftsRepo.remove(shift);
    return {
      success: true,
      message: `Shift with id ${shiftId} has been deleted successfully`,
    };
  }

  async getShiftsByClinicId(clinicId: number): Promise<IWorkerShifts[]> {
    return this.workerShiftsRepo.find({
      relations: ['worker', 'worker.dentistry', 'worker.specialty'],
      where: {
        worker: {
          dentistry: { id: clinicId },
        },
      },
      order: { shift_date: 'ASC', start_time: 'ASC' },
    });
  }
}
