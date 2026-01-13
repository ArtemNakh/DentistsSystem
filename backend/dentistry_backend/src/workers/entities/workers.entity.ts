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
import { IWorker } from './workers.interface';
import { Specialty } from '../../specialty/entities/specialty.entity';
import { Dentistry } from '../../dentistry/entities/dentistry.entity';
import { License } from '../../license/entities/license.entity';
import { WorkerShifts } from '../../worker-shifts/entities/worker-shifts.entity';
import { Appointment } from '../../appointment/entity/appointment.entity';

@Entity({ name: 'workers' })
export class Worker implements IWorker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  surname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  middle_name: string;

  @Column({ type: 'date', nullable: false })
  birthday: Date;

  @Column({ type: 'varchar', length: 30, nullable: false })
  phone: string;

  @ManyToOne(() => Specialty, (specialty) => specialty.workers)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @ManyToOne(() => Dentistry, (dentistry) => dentistry.workers)
  @JoinColumn({ name: 'dentistry_id' })
  dentistry: Dentistry;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  //Foreign connection
  @OneToMany(() => License, (license) => license.worker)
  licenses: License[];

  @OneToMany(() => WorkerShifts, (shift) => shift.worker)
  shifts: WorkerShifts[];

  @OneToMany(() => Appointment, (appointmen) => appointmen.dentist)
  appointments: Appointment[];
}
