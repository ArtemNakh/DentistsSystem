import { Dentistry } from 'src/dentistry/entities/dentistry.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';


export interface IWorker {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date;
  phone: string;
  specialty: Specialty;
  dentistry: Dentistry;
  login: string;
  password: string;

  created_at: Date;
  updated_at: Date;
}
