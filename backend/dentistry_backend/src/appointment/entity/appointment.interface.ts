import { IAppointmentActions } from "src/appointment-action/entity/appointment-action.interface";
import { IClient } from "src/clients/entities/client.interface";
import { IWorker } from "src/workers/entities/workers.interface";

export enum StatusAppointment{
    SCHEDULE='schedule',
    COMPLETED='completed',
    WAIT_PAID='wait_paid',
    CANCELLED='cancelled'
}

export interface IAppointment{
 id:number;
 client:IClient;
 dentist:IWorker;
 appointment_date:Date;
 notes:string;
 status:StatusAppointment;

 created_at:Date;
 updated_at:Date;


 //foreign connection
 appointment_actions?:IAppointmentActions[];
}