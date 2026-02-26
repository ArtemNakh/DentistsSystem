import { ClientActionSaga } from "../../ClientEntity";

interface AddClientPayload {}

export const AddClient = (payload: AddClientPayload) => ({
  type: ClientActionSaga.AddClient,
  payload,
});

export type AddClientAction = ReturnType<typeof AddClient>;
