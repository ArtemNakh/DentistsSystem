import { Injectable } from '@nestjs/common';
import { AppointmentActions } from './entity/appointment-action.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAppointmentActions } from './entity/appointment-action.interface';

@Injectable()
export class AppointmentActionService {
  constructor(
    @InjectRepository(AppointmentActions)
    private appointmentActionRepo: Repository<AppointmentActions>,
  ) {}

  findAll(): Promise<IAppointmentActions[]> {
    return this.appointmentActionRepo.find({
      relations: ['appointment', 'operation'],
    });
  }
}
