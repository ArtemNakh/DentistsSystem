import { IWorkerShifts } from './worker-shifts.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/workers.entity';

@Entity({ name: 'workers_shifts' })
export class WorkerShifts implements IWorkerShifts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Worker, (worker) => worker.shifts)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column({ type: 'date', nullable: false })
  shift_date: Date;

  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: false })
  end_time: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
