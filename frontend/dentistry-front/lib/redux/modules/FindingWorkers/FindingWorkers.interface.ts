import { IDentistry } from "../Dentistries/Dentistry.interface";
import { ISpecialty } from "../Specialties/Entities/Specialties/Specialties.interface";

export interface IFindingWorker {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date;
  phone: string;
  specialty: ISpecialty; //   specialty: ISpecialty;
  dentistry: IDentistry; //   dentistry: IDentistry;
  login: string;
  password: string;

  created_at: Date;
  updated_at: Date;

  //foreign connections
  //   licenses?: ILicense[];
  //   appointments?: IAppointment[];
  //   shifts?: IWorkerShifts[];
}
