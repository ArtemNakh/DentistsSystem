import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkerShifts } from './entities/worker-shifts.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '@/workers/entities/workers.entity';
import { CreateWorkerShiftDto } from './dto/CreateWorker-shift.dto';
import { IWorkerShifts } from './entities/worker-shifts.interface';
import { WorkersService } from '@/workers/workers.service';
import { Appointment } from '@/appointment/entity/appointment.entity';
@Injectable()
export class WorkerShiftsService {
  constructor(
    @InjectRepository(WorkerShifts)
    private workerShiftsRepo: Repository<WorkerShifts>,
    @InjectRepository(Worker)
    private readonly workerRepo: Repository<Worker>,

    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly workerService: WorkersService,
  ) {}
  /**
   * Отримати всі зміни працівників.
   * @returns Масив змін з інформацією про працівників та їх спеціальність
   */
  findAll(): Promise<WorkerShifts[]> {
    return this.workerShiftsRepo.find({
      relations: ['worker', 'worker.specialty'],
    });
  }

  /**
   * Отримати всі зміни конкретного працівника.
   * @param workerId - ID працівника
   * @throws NotFoundException якщо працівника не знайдено
   * @returns Масив змін цього працівника, відсортованих за датою
   */
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
   * Отримати кількість неробочих днів для всіх лікарів у стоматології.
   * @param dentistryId - ID стоматології
   * @param startDate - початок періоду
   * @param endDate - кінець періоду
   * @returns Масив об’єктів { worker, weekendDays }
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
   * Отримати кількість неробочих днів для конкретного лікаря.
   * @param workerId - ID працівника
   * @param startDate - початок періоду
   * @param endDate - кінець періоду
   * @throws Error якщо працівника не знайдено
   * @returns Об’єкт { worker, weekendDays }
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

  /**
   * Створити нову зміну для працівника.
   * Виконує перевірку на дублювання та перетин часу.
   * @param dto - DTO з даними для створення зміни
   * @throws NotFoundException якщо працівника не знайдено
   * @throws ConflictException якщо зміна дублюється або перетинається з існуючою
   * @returns Створена зміна
   */
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

    // Перевірка на перетин часу
    const overlappingShift = await this.workerShiftsRepo.findOne({
      where: {
        worker: { id: dto.workerId },
        shift_date: dto.shift_date,
        // умова: новий інтервал перетинається з існуючим
        start_time: LessThanOrEqual(dto.end_time),
        end_time: MoreThanOrEqual(dto.start_time),
      },
    });

    if (overlappingShift) {
      throw new ConflictException(
        `Shift for worker ${dto.workerId} on ${dto.shift_date} overlaps with existing shift (${overlappingShift.start_time} - ${overlappingShift.end_time})`,
      );
    }
    const shift = this.workerShiftsRepo.create({ ...dto, worker });
    return this.workerShiftsRepo.save(shift);
  }

  /**
   * Видалити зміну.
   * @param shiftId - ID зміни
   * @throws NotFoundException якщо зміну не знайдено
   * @returns Об’єкт з success=true та повідомленням
   */
  async removeShift(
    shiftId: number,
  ): Promise<{ success: boolean; message: string }> {
    const shift = await this.workerShiftsRepo.findOne({
      where: { id: shiftId },
    });
    if (!shift) throw new NotFoundException('Shift not found');

    // Перевірка чи є прийоми на цю зміну

    // знайти прийоми для цього працівника у межах зміни
    const existingAppointments = await this.appointmentRepo.find({
      where: {
        dentist: { id: shift.worker.id }, // або worker_id: shift.worker_id
        appointment_date: Between(
          new Date(`${shift.shift_date}T${shift.start_time}`),
          new Date(`${shift.shift_date}T${shift.end_time}`),
        ),
      },
    });

    if (existingAppointments.length > 0) {
      throw new ConflictException(
        `Cannot delete shift with id ${shiftId} because it has ${existingAppointments.length} appointment(s) assigned`,
      );
    }
    await this.workerShiftsRepo.remove(shift);
    return {
      success: true,
      message: `Shift with id ${shiftId} has been deleted successfully`,
    };
  }

  /**
   * Отримати всі зміни працівників конкретної стоматології.
   * @param clinicId - ID стоматології
   * @returns Масив змін з інформацією про працівників, їх стоматологію та спеціальність
   */
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
