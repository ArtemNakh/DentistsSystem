import { IAppointment } from '@/appointment/entity/appointment.interface';
import { INotification, TypeRemaind } from './notification.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../appointment/entity/appointment.entity';

@Entity({ name: 'notifications' })
export class Notification implements INotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.notifications)
  @JoinColumn({ name: 'appointment_id' })
  appointment: IAppointment;

  @Column({ type: 'varchar', length: 255, nullable: false })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_send: boolean;

  @Column({ type: 'enum', enum: TypeRemaind, nullable: false })
  type_remaind: TypeRemaind;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
