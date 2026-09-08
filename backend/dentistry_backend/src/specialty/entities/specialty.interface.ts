import { IWorker } from '@/workers/entities/workers.interface';

export enum SpecialtyType {
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  RECEPTION='reception'
}

export interface ISpecialty {
  id: number;
  name: string;
  description?: string;
  type: SpecialtyType;
  created_at: Date;
  updated_at: Date;

  //foreign connections
  worker?: IWorker[];
}
