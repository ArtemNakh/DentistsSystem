import { IDentistry } from "../Dentistries/Dentistry.interface";
import { ISpecialty } from "../Specialties/Specialties.interface";

export interface IWorker {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date;
  phone: string;
  specialty: ISpecialty; 
  dentistry: IDentistry; 
  login: string;
  password: string;
 active: boolean; 
  created_at: Date;
  updated_at: Date;

  //foreign connections
  //   licenses?: ILicense[];
  //   appointments?: IAppointment[];
  //   shifts?: IWorkerShifts[];
}
