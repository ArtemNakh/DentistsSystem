import { BloodSign } from "../entities/client.interface";

export interface CreateClientInput {
  name: string;
  surname: string;
  middle_name: string;
  birthdate: Date;
  blood_resus: BloodSign;
  blood_group:number;
  phone: string;
  allergic_diseases: string;
  email: string;
  password: string;
}
