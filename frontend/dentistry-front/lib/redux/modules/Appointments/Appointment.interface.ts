import { IClient } from "../clients/clients.interface";
import { IWorker } from "../Workers/Workers.interface";

export enum StatusAppointment {
  SCHEDULE = "schedule",
  COMPLETED = "completed",
  WAIT_PAID = "wait_paid",
  CANCELLED = "cancelled",
}

export interface IAppointment {
  id: number;
  client: IClient;
  dentist: IWorker;
  appointment_date: Date;
  notes: string;
  status: StatusAppointment;

  created_at: Date;
  updated_at: Date;
}


// Експортуйте також для Redux типізування
export type AppointmentState = Record<string, IAppointment>;
