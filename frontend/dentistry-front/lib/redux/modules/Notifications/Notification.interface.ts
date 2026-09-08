import { IAppointment } from "../Appointments/Appointment.interface";

export enum TypeRemaind {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  PAYMENT_REMINDER = 'payment_reminder',
  GENERAL = 'general',
  PLANNED_APPOINTMENT = 'planned_appointment',
}
export interface INotification {
  id: number;
  appointment: IAppointment;
  message: string;
  is_send: boolean;
  type_remaind: TypeRemaind;

  created_at: Date;
  updated_at: Date;
}
