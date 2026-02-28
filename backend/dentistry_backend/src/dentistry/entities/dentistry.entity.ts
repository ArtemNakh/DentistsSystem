import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IDentistry } from './dentistry.interface';
import { Worker } from '../../workers/entities/workers.entity';
import { OperationList } from '../../operation-list/entities/operation-list.entity';

@Entity({ name: 'dental_clinics' })
export class Dentistry implements IDentistry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  street: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  region: string;

  @OneToMany(() => Worker, (worker) => worker.dentistry)
  workers: Worker[];
  
  @OneToMany(() => OperationList, (operation) => operation.dental_clinic)
  operation_lists: OperationList[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
