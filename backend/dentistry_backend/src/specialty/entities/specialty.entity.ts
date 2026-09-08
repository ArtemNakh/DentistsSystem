import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ISpecialty, SpecialtyType } from './specialty.interface';
import { Worker } from '../../workers/entities/workers.entity';

@Entity({ name: 'specialties' })
export class Specialty implements ISpecialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SpecialtyType, nullable: false })
  type: SpecialtyType;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Worker, (worker) => worker.specialty)
  workers: Worker[];
}
