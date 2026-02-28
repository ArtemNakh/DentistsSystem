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
import { IOperationList } from './operation-list.interface';
import { AppointmentActions } from '../../appointment-action/entity/appointment-action.entity';
import { Dentistry } from '../../dentistry/entities/dentistry.entity';

@Entity({ name: 'operation_list' })
export class OperationList implements IOperationList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'double', nullable: false })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  //foreign connection
  @OneToMany(
    () => AppointmentActions,
    (appointment_action) => appointment_action.operation,
  )
  appointment_actions: AppointmentActions[];

  @ManyToOne(() => Dentistry, (dentistry) => dentistry.operation_lists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'dental_clinic_id' })
  dental_clinic: Dentistry;
}
