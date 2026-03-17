import { IAppointment } from 'src/appointment/entity/appointment.interface';
import { IDentistry } from 'src/dentistry/entities/dentistry.interface';
import { ILicense } from 'src/license/entities/license.interface';
import { ISpecialty } from 'src/specialty/entities/specialty.interface';
import { IWorkerShifts } from 'src/worker-shifts/entities/worker-shifts.interface';

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

  created_at: Date;
  updated_at: Date;
   active: boolean; 
   
  //foreign connections
  licenses?: ILicense[];
  appointments?: IAppointment[];
  shifts?: IWorkerShifts[];
}
