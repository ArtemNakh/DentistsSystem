import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import {
  IAppointment,
  StatusAppointment,
} from './entity/appointment.interface';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { Worker } from 'src/workers/entities/workers.entity';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Worker)
    private readonly workerRepo: Repository<Worker>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  findAll(): Promise<IAppointment[]> {
    return this.appointmentRepo.find({ relations: ['client', 'dentist'] });
  }

  findNearest(date: Date, dentistryId: number): Promise<IAppointment[]> {
    const formatted = date.toISOString().split('T')[0];

    this.logger.log(
      `findNearest called with date=${formatted}, dentistryId=${dentistryId}`,
    );
    if (isNaN(dentistryId)) {
      throw new BadRequestException('Invalid id');
    }
    return this.appointmentRepo.find({
      relations: ['client', 'dentist'],
      where: {
        appointment_date: Raw((alias) => `DATE(${alias}) = :date`, {
          date: formatted,
        }),
        dentist: {
          dentistry: { id: dentistryId },
        },
      },
      order: { appointment_date: 'ASC' },
    });
  }

  async getTodayAppointmentsByDentistry(
    dentistryId: number,
  ): Promise<IAppointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return this.appointmentRepo.find({
      where: {
        dentist: { dentistry: { id: dentistryId } },
        appointment_date: Between(startOfDay, endOfDay),
      },
      relations: [
        'client',
        'dentist',
        'dentist.specialty',
        'dentist.dentistry',
        'payment',

        'appointment_actions',
      ],
    });
  }

  async getAppointmentsByDentistry(
    dentistryId: number,
  ): Promise<IAppointment[]> {
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException('Invalid dentistryId provided');
    }

    try {
      const appointments = this.appointmentRepo.find({
        where: { dentist: { dentistry: { id: dentistryId } } },
        relations: ['dentist', 'dentist.dentistry', 'client'], // якщо потрібні зв’язки
      });

      if (!appointments || (await appointments).length === 0) {
        throw new NotFoundException(
          `No appointments found for dentistry with id ${dentistryId}`,
        );
      }

      return appointments;
    } catch (error) {
      // Логування для дебагу
      console.error('Error fetching appointments by dentistry:', error); // Якщо це вже NestJS exception — пробросимо далі
      if (error instanceof HttpException) {
        throw error;
      } // Інакше — внутрішня помилка
      throw new InternalServerErrorException(
        'Unexpected error while fetching appointments',
      );
    }
  }

  async getHistoryByDentistry(dentistryId: number): Promise<IAppointment[]> {
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException('Invalid dentistryId provided');
    }

    try {
      const now = new Date();
      const appointments = this.appointmentRepo.find({
        where: {
          dentist: { dentistry: { id: dentistryId } },
          appointment_date: LessThanOrEqual(now),
        },
        relations: [
          'dentist',
          'dentist.dentistry',
          'client',
          'appointment_actions',
          // ось тут додаєш
          'appointment_actions.operation', // якщо треба підтягнути операцію
          'payment', // якщо потрібна оплата
        ], // якщо потрібні зв’язки
      });

      if (!appointments || (await appointments).length === 0) {
        throw new NotFoundException(
          `No appointments found for dentistry with id ${dentistryId}`,
        );
      }

      return appointments;
    } catch (error) {
      // Логування для дебагу
      console.error('Error fetching appointments by dentistry:', error); // Якщо це вже NestJS exception — пробросимо далі
      if (error instanceof HttpException) {
        throw error;
      } // Інакше — внутрішня помилка
      throw new InternalServerErrorException(
        'Unexpected error while fetching appointments',
      );
    }
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<IAppointment> {
    try {
      if (!createAppointmentDto) {
        throw new Error('Dto without values');
      }

      const newAppointment = this.appointmentRepo.create({
        client: { id: createAppointmentDto.clientId },
        dentist: { id: createAppointmentDto.dentistId },
        appointment_date: createAppointmentDto.appointment_date,
        notes: createAppointmentDto.notes,
        status: StatusAppointment.SCHEDULE,
      });
      const savedAppointment = await this.appointmentRepo.save(newAppointment);

      // Отримуємо повний appointment з усіма потрібними relations
      const fullAppointment = await this.appointmentRepo.findOne({
        where: { id: savedAppointment.id },
        relations: [
          'client',
          'dentist',
          'dentist.specialty',
          'dentist.dentistry',
          'appointment_actions',
          'payment',
        ],
      });

      if (!fullAppointment) {
        throw new InternalServerErrorException(
          'Failed to load full appointment after save',
        );
      }

      await this.notificationService.informPlannedAppointment({
        appointment: fullAppointment,
      });
      return savedAppointment;
    } catch (err) {
      throw new InternalServerErrorException(
        'Unexpected error while fetching appointments',
      );
    }
  }

  // Отримати всі appointment для працівника на 3 місяці наперед
  async findAppointmentsForWorkerToNext3Month(
    workerId: number,
  ): Promise<IAppointment[]> {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    return this.appointmentRepo.find({
      where: {
        dentist: { id: workerId },
        appointment_date: Between(now, threeMonthsLater),
      },
      relations: ['dentist', 'client'],
      order: { appointment_date: 'ASC' },
    });
  }

  // Отримати всі appointment для працівника
  async findAppointmentsForWorker(workerId: number): Promise<IAppointment[]> {
    return this.appointmentRepo.find({
      where: {
        dentist: { id: workerId },
      },
      relations: ['dentist', 'client', 'appointment_actions', 'payment'],
    });
  }

  async updateStatus(appointmentId: number, newStatus: StatusAppointment) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with id ${appointmentId} not found`,
      );
    }

    appointment.status = newStatus;
    appointment.updated_at = new Date();

    await this.appointmentRepo.save(appointment);

    return {
      message: {
        code: 'success',
        text: `Appointment ${appointmentId} status updated to ${newStatus}`,
      },
      data: [appointment],
    };
  }

  async getWorkerAppointmentsStatsByDentistry(dentistryId: number) {
    const workers = await this.workerRepo.find({
      where: {
        dentistry: { id: dentistryId },
        specialty: { type: SpecialtyType.DOCTOR },
      },
      relations: ['appointments', 'specialty', 'dentistry'],
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return workers.map((worker) => {
      const appointmentsLastMonth =
        worker.appointments?.filter((a) => a.appointment_date >= oneMonthAgo) ||
        [];

      const stats = {
        total: appointmentsLastMonth.length,
        schedule: appointmentsLastMonth.filter(
          (a) => a.status === StatusAppointment.SCHEDULE,
        ).length,
        completed: appointmentsLastMonth.filter(
          (a) => a.status === StatusAppointment.COMPLETED,
        ).length,
        waitPaid: appointmentsLastMonth.filter(
          (a) => a.status === StatusAppointment.WAIT_PAID,
        ).length,
        cancelled: appointmentsLastMonth.filter(
          (a) => a.status === StatusAppointment.CANCELLED,
        ).length,
      };

      return {
        worker: {
          id: worker.id,
          name: worker.name,
          surname: worker.surname,
          specialty: worker.specialty?.name,
        },
        stats,
      };
    });
  }

  async getAppointmentById(id: number): Promise<IAppointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: [
        'client',
        'dentist',
        'dentist.specialty',
        'appointment_actions.operation',
        'payment',
      ],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async findByClientId(clientId: number): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { client: { id: clientId } },
      relations: [
        'client',
        'dentist',
        'dentist.specialty',
        'dentist.dentistry',
        'payment',
        'appointment_actions.operation',
      ],
    });
  }

  /**
   * Знаходить найближчі записи клієнтів для стоматології.
   * @param dentistryId ID стоматології
   * @param startDate Початкова дата (необов’язково)
   * @param endDate Кінцева дата (необов’язково)
   * @returns Масив записів на прийом
   */
  async findNearestClientsAppoinment({
    dentistryId,
    startDate,
    endDate,
  }: {
    dentistryId: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<IAppointment[]> {
    // Перевірка даних аршумента
    if (!dentistryId || dentistryId <= 0) {
      throw new BadRequestException(
        'Dentistry ID is required and must be valid',
      );
    }

    try {
      // базовий фільтр по клініці
      const whereCondition: any = {
        dentist: { dentistry: { id: dentistryId } },
      };

      // якщо передано початкову дату
      if (startDate) {
        whereCondition.appointment_date = MoreThanOrEqual(startDate);
      }

      // якщо передано кінцеву дату
      if (endDate) {
        if (whereCondition.appointment_date) {
          // комбінуємо умови
          whereCondition.appointment_date = Between(
            startDate ?? new Date(0),
            endDate,
          );
        } else {
          whereCondition.appointment_date = LessThanOrEqual(endDate);
        }
      }
      const appointments = this.appointmentRepo.find({
        where: whereCondition,
        relations: [
          'client',
          'dentist',
          'dentist.specialty',
          'dentist.dentistry',
        ],
        order: { appointment_date: 'ASC' },
      });

      // перевірка на присутність даних
      if (!appointments || (await appointments).length === 0) {
        this.logger.warn(
          `No upcoming appointments found for dentistry with ID ${dentistryId}`,
        );
        return [];
      }
      return appointments;
    } catch (error: any) {
      this.logger.error(
        `Error while finding nearest appointments for dentistry ${dentistryId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve nearest appointments',
      );
    }
  }

  
}
