import { IClient } from "../Clients/clients.interface";
import { IPayment } from "../Payments/Payments.interface";
import { IWorker } from "../Workers/Workers.interface";

export enum StatusAppointment {
  SCHEDULE = "schedule",
  COMPLETED = "completed",
  WAIT_PAID = "wait_paid",
  CANCELLED = "cancelled",
}

export interface IAppointment {
  id: number;
  client: IClient |null;
  dentist: IWorker|null;
  appointment_date: Date;
  notes: string;
  status: StatusAppointment;

  created_at: Date;
  updated_at: Date;

  //  appointment_actions?: IAppointmentActions[];
  payment?: IPayment;
}


