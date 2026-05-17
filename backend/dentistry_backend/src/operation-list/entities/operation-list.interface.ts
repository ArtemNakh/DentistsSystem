import { IAppointmentActions } from '@/appointment-action/entity/appointment-action.interface';
import { IDentistry } from '@/dentistry/entities/dentistry.interface';

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
