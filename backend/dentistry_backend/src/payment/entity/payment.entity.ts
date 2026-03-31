import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IPayment, MethodPayment, StatusPayment } from './payment.interface';
import { IAppointment } from '../../appointment/entity/appointment.interface';
import { Appointment } from '../../appointment/entity/appointment.entity';
@Entity({ name: 'payments' })
export class Payment implements IPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Appointment, (appointment) => appointment.payment, {
    nullable: false,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: StatusPayment, nullable: false })
  status_paid: StatusPayment;

  @Column({ type: 'enum', enum: MethodPayment, nullable: false })
  method_pay: MethodPayment;

  @Column({ type: 'date', nullable: false })
  payment_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
