import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BloodSign, IClient } from './client.interface';

@Entity({ name: 'clients' })
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  surname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  middle_name: string;

  @Column({ type: 'date', nullable: false })
  birthdate: Date;

  @Column({ type: 'enum', enum: BloodSign })
  blood_resus: BloodSign;

  @Column({ type: 'int', nullable: false })
  blood_group: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  allergic_diseases: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ name: 'isverified', type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
