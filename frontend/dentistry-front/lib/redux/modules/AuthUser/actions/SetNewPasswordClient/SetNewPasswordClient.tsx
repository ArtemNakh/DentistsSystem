import { AuthActionSaga } from "../../AuthUser.Entity";

interface SetNewPasswordClientPayload {
  token: string;
  password: string;
}

export const SetNewPasswordClient = (payload: SetNewPasswordClientPayload) => ({
  type: AuthActionSaga.SetNewPasswordClient,
  payload,
});

export type SetNewPasswordClientAction = ReturnType<
  typeof SetNewPasswordClient
>;
