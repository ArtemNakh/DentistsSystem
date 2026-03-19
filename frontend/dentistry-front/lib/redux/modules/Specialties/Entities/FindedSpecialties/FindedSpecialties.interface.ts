import { IWorker } from "../../../Workers/Workers.interface";

export enum SpecialtyType {
  DOCTOR = "doctor",
    RECEPTION= "reception",
  ADMIN = "admin",
}

export interface IFindedSpecialty {
  id: number;
  name: string;
  description?: string;
  type: SpecialtyType;
  created_at: Date;
  updated_at: Date;

  //foreign connections
  worker?: IWorker[];
}
