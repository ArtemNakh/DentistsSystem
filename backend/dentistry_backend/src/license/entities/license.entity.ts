import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ILicense } from './license.interface';
import { IWorker } from '../../workers/entities/workers.interface';
import { Worker } from '../../workers/entities/workers.entity';

@Entity({ name: 'licenses' })
export class License implements ILicense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Worker, (worker) => worker.licenses)
  @JoinColumn({ name: 'worker_id' })
  worker: IWorker;

  @Column({ type: 'date', nullable: false })
  issue_date: Date;

  @Column({ type: 'varchar', length: 170, nullable: false })
  issued_by: string;

  @Column({ type: 'varchar', length: 170, nullable: false })
  number_license: string;

  @Column({ type: 'date', nullable: false })
  expiration_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
