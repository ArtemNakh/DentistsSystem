import { AuthActionSaga } from "../../AuthUser.Entity";

interface GetAuthWorkerPayload {}

export const getAuthWorker = (payload: GetAuthWorkerPayload) => ({
  type: AuthActionSaga.GetAuthWorker,
  payload,
});

export type GetAuthWorkerAction = ReturnType<typeof getAuthWorker>;
