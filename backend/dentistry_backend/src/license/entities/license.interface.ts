import { IWorker } from '@/workers/entities/workers.interface';

export interface ILicense {
  id: number;
  worker: IWorker;
  issue_date: Date;
  issued_by: string;
  number_license: string;
  expiration_date: Date;
  created_at: Date;
  updated_at: Date;
}
