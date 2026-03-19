export interface CreateWorkerDto {
  name: string;
  surname: string;
  middle_name: string;
  birthday: Date;
  phone: string;
  specialtyId: number;
  dentistryId: number;
  login: string;
  password: string;
}