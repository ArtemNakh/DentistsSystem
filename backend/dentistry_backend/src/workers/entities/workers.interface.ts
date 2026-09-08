import { IAppointment } from '@/appointment/entity/appointment.interface';
import { IDentistry } from '@/dentistry/entities/dentistry.interface';
import { ILicense } from '@/license/entities/license.interface';
import { ISpecialty } from '@/specialty/entities/specialty.interface';
import { IWorkerShifts } from '@/worker-shifts/entities/worker-shifts.interface';

export interface IWorker {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date ;
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
