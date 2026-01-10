import { Dentistry } from 'src/dentistry/entities/dentistry.entity';
import { IDentistry } from 'src/dentistry/entities/dentistry.interface';
import { ILicense } from 'src/license/entities/license.interface';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { ISpecialty } from 'src/specialty/entities/specialty.interface';


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
  licenses?: ILicense[];

  created_at: Date;
  updated_at: Date;

  
}
