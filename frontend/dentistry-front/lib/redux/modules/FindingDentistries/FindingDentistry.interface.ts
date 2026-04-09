import { IWorker } from "../Workers/Workers.interface";

export interface IDentistry {
  id: number;
  street: string;
  city: string;
  region: string;

  worker?: IWorker[];
  // operation_lists: IOperationList[];
  created_at: Date;
  updated_at: Date;
}
