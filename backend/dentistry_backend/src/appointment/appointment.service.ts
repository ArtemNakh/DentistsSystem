import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { IAppointment } from './entity/appointment.interface';
import { Between, MoreThanOrEqual, Raw, Repository } from 'typeorm';

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

  async getTodayAppointmentsByWorker(
    workerId: number,
  ): Promise<IAppointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return this.appointmentRepo.find({
      where: {
        dentist: { id: workerId },
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
}
