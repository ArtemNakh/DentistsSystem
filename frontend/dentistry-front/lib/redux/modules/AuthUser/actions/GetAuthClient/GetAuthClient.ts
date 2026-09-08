import { AuthActionSaga } from "../../AuthUser.Entity";

interface GetAuthClientPayload {}

export const getAuthClient = (payload: GetAuthClientPayload) => ({
  type: AuthActionSaga.GetAuthClient,
  payload,
});

export type GetAuthClientAction = ReturnType<typeof getAuthClient>;
