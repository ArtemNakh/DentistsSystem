import { IWorker } from 'src/workers/entities/workers.interface';

export enum SpecialtyType {
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export interface ISpecialty {
  id: number;
  name: string;
  description?: string;
  type: SpecialtyType;
  worker?: IWorker[];
  created_at: Date;
  updated_at: Date;
}
