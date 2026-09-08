import { ClientActionSaga } from "../../ClientEntity";

interface GetClientsPayload {}

export const GetClients = (payload: GetClientsPayload) => ({
  type: ClientActionSaga.GetClient,
  payload,
});

export type GetClientAction = ReturnType<typeof GetClients>;
