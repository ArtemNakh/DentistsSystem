import { IAppointment } from "../Appointments/Appointment.interface";
import { IOperationList } from "../OperationList/OperationList.interface";

export interface IAppointmentActions {
  id: number;
  appointment: IAppointment;
  operation: IOperationList;
  created_at: Date;
  updated_at: Date;
}
