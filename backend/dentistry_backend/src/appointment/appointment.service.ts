import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
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

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  findAll(): Promise<IAppointment[]> {
    return this.appointmentRepo.find({ relations: ['client', 'dentist'] });
  }

  findNearest(date: Date, dentistryId: number): Promise<IAppointment[]> {
    const formatted = date.toISOString().split('T')[0]; // "2026-04-14"
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
      const result = await this.appointmentRepo.save(newAppointment);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        'Unexpected error while fetching appointments',
      );
    }
  }

  // Отримати всі appointment для працівника на 3 місяці наперед
  async findAppointmentsForWorker(workerId: number): Promise<IAppointment[]> {
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
}
