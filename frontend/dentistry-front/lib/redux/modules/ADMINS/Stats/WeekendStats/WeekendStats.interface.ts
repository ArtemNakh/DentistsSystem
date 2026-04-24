import { IWorker } from "../../../Workers/Workers.interface";

export interface ISpecialty {
  id: number;
  name: string;
  description?: string;
}



export interface IWorkerWeekend {
  id: number;
  worker: IWorker | null;
  weekendDays: number;
  created_at: Date;
  updated_at: Date;
}