export enum BloodSign {
  plus = 'plus',
  minus = 'minus',
}

export interface IRegisterClient {
  name: string;
  surname: string;
  middle_name: string;
  birthdate: string;
  blood_resus: BloodSign;
  blood_group: number;
  phone: string;
  allergic_diseases: string;
  email: string;
  password: string;
  passwordRepeat: string;
}
