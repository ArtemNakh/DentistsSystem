import { ClientActionSaga } from "../../ClientEntity";
export enum BloodSign {
  plus = "plus",
  minus = "minus",
}

export interface AddClientPayload {
  name: string;

  surname: string;

  middle_name: string;

  birthdate: Date;

  blood_resus: BloodSign;

  blood_group: number;

  phone: string;

  allergic_diseases: string;

  email: string;

  password: string;

  passwordRepeat: string;
}

export const AddClient = (payload: AddClientPayload) => ({
  type: ClientActionSaga.AddClient,
  payload,
});

export type AddClientAction = ReturnType<typeof AddClient>;
