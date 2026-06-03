import { IAppointmentActions } from "../AppointmentsActions/AppointmentActions.interface";
import { IDentistry } from "../Dentistries/Dentistry.interface";

export interface IOperationList {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  price: number;
  dental_clinic: IDentistry;
  active: boolean;
  //foreign connection
  appointment_action?: IAppointmentActions[];
}
