import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { IAppointment } from './entity/appointment.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  findAll(): Promise<IAppointment[]> {
    return this.appointmentRepo.find({ relations: ['client'] });
  }
}
