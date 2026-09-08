import { AuthActionSaga } from "../../AuthUser.Entity";

interface LogoutAuthWorkerPayload {}

export const logoutWorker = (payload: LogoutAuthWorkerPayload) => ({
  type: AuthActionSaga.logoutWorker,
  payload,
});

export type LogoutAuthWorkerAction = ReturnType<typeof logoutWorker>;
