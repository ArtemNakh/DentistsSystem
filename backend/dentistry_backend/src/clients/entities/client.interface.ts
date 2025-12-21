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
  phone: string;
  allergic_diseases: string;
  email: string;
  password: string;

  created_at: Date;
  updated_at: Date;
}
