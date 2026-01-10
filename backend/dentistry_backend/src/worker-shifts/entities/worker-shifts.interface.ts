import { IWorker } from '../../workers/entities/workers.interface';

export interface IWorkerShifts {
  id: number;
  worker: IWorker;
  shift_date: Date;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
}
