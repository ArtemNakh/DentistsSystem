import { ClientActionSaga } from "../../ClientEntity";
export enum BloodSign {
  plus = "plus",
  minus = "minus",
}

export interface UpdateClientPayload {
  id: number; // обов’язковий
  name?: string;
  surname?: string;
  middle_name?: string;
  birthdate?: string;
  blood_resus?: BloodSign;
  blood_group?: number;
  phone?: string;
  allergic_diseases?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
}
export const UpdateClient = (payload: UpdateClientPayload) => ({
  type: ClientActionSaga.UpdateClient,
  payload,
});

export type UpdateClientAction = ReturnType<typeof UpdateClient>;
