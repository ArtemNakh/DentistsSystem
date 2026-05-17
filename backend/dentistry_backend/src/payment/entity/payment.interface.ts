import { IAppointment } from '@/appointment/entity/appointment.interface';

export enum StatusPayment {
  PAID = 'paid',
  
  NOT_PAID = 'not_paid',
}

export enum MethodPayment {
  CARD = 'card',
  CASH = 'cash',
  TRANSFER = 'transfer',
}

export interface IPayment {
  id: number;
  appointment: IAppointment;
  amount: number;
  status_paid: StatusPayment;
  method_pay: MethodPayment;
  payment_date: Date;
  
  created_at: Date;
  updated_at: Date;

  //foreign connect
}
