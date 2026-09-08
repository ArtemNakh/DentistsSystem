import { IAppointment } from '@/appointment/entity/appointment.interface';
import { IOperationList } from '@/operation-list/entities/operation-list.interface';

export interface IAppointmentActions {
  id: number;
  appointment: IAppointment;
  operation: IOperationList;
  created_at: Date;
  updated_at: Date;

  
}
