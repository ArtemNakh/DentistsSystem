import { IAppointment } from 'src/appointment/entity/appointment.interface';
import { IOperationList } from 'src/operation-list/entities/operation-list.interface';

export interface IAppointmentActions {
  id: number;
  appointment: IAppointment;
  operation: IOperationList;
  created_at: Date;
  updated_at: Date;

  
}
