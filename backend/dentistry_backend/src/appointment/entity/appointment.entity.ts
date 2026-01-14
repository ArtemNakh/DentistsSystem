import { IAppointment, StatusAppointment } from './appointment.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Worker } from '../../workers/entities/workers.entity';
import { AppointmentActions } from '../../appointment-action/entity/appointment-action.entity';
import { Notification } from '../../notification/entity/notification.entity';

@Entity({ name: 'appointments' })
export class Appointment implements IAppointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.appointments)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Worker, (worker) => worker.appointments)
  @JoinColumn({ name: 'worker_id' })
  dentist: Worker;

  @Column({ type: 'date', nullable: false })
  appointment_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  notes: string;

  @Column({ type: 'enum', enum: StatusAppointment, nullable: false })
  status: StatusAppointment;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  //Foreign connection
  @OneToMany(
    () => AppointmentActions,
    (appointment_action) => appointment_action.appointment,
  )
  appointment_actions: AppointmentActions[];

  @OneToMany(() => Notification, (notification) => notification.appointment)
  notifications: Notification[];
}
