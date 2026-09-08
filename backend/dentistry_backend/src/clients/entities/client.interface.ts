import { IAppointment } from "@/appointment/entity/appointment.interface";

export enum BloodSign {
  plus = 'plus',
  minus = 'minus',
}

export interface IClient {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthdate: Date;
  blood_resus: BloodSign;
  blood_group: number;
  phone: string;
  allergic_diseases: string;
  email: string;
  password: string;
  isVerified: boolean;
  
  created_at: Date;
  updated_at: Date;

  //foreign connections
  appointments?:IAppointment[];

}
