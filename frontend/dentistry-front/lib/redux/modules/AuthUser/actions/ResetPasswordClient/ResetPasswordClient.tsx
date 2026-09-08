import { AuthActionSaga } from "../../AuthUser.Entity";

interface ResetPasswordClientPayload {
  email: string;
}

export const ResetPasswordClient = (
  payload: ResetPasswordClientPayload,
) => ({
  type: AuthActionSaga.ResetPasswordClient,
  payload,
});

export type ResetPasswordClientAction = ReturnType<
  typeof ResetPasswordClient
>;
