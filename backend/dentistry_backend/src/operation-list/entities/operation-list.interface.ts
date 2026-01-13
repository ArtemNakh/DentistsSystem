import { IAppointmentActions } from 'src/appointment-action/entity/appointment-action.interface';

export interface IOperationList {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  price: number;

  //foreign connection
  appointment_action?: IAppointmentActions[];
}
