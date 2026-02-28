import { IAppointmentActions } from 'src/appointment-action/entity/appointment-action.interface';
import { IDentistry } from 'src/dentistry/entities/dentistry.interface';

export interface IOperationList {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  price: number;
  dental_clinic: IDentistry;
  //foreign connection
  appointment_action?: IAppointmentActions[];
}
