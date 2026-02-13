import { Injectable } from '@nestjs/common';
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

  findNearest(date: Date): Promise<IAppointment[]> {
    const formatted = date.toISOString().split('T')[0]; // "2026-04-14"
    return this.appointmentRepo.find({
      relations: ['client', 'dentist'],
      where: {
        appointment_date: Raw((alias) => `DATE(${alias}) = :date`, {
          date: formatted,
        }),
      },
      order: { appointment_date: 'ASC' },
    });

    // const formatted = date.toISOString().split('T')[0]; // "2026-04-14"
    // return this.appointmentRepo.find({
    //   relations: ['client', 'dentist'],
    //   where: {
    //     appointment_date: Raw((alias) => `DATE(${alias}) = :date`, {
    //       date: formatted,
    //     }),
    //   },
    // });
  }
}
