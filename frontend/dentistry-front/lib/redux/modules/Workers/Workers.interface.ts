export interface IWorker {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date;
  phone: string;
  specialty: any; //   specialty: ISpecialty;
  dentistry: any; //   dentistry: IDentistry;
  login: string;
  password: string;

  created_at: Date;
  updated_at: Date;

  //foreign connections
  //   licenses?: ILicense[];
  //   appointments?: IAppointment[];
  //   shifts?: IWorkerShifts[];
}
