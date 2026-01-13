import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IAppointmentActions } from './appointment-action.interface';

import { Appointment } from '../../appointment/entity/appointment.entity';
import { OperationList } from '../../operation-list/entities/operation-list.entity';

@Entity({ name: 'appointments_actions' })
export class AppointmentActions implements IAppointmentActions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.appointment_actions,
  )
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToOne(
    () => OperationList,
    (operation_list) => operation_list.appointment_actions,
  )
  @JoinColumn({ name: 'operation_id' })
  operation: OperationList;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
