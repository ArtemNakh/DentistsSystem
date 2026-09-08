import { WorkerActionSaga } from "../../Workers.Entity";

interface GetInfoWorkersByDentistryPayload {
  idDentistry: number;
}

export const GetInfoWorkersByDentistry = (payload: GetInfoWorkersByDentistryPayload) => ({
  type: WorkerActionSaga.GetInfoWorkersByDentistry,
  payload,
});

export type GetInfoWorkersByDentistryAction = ReturnType<typeof GetInfoWorkersByDentistry>;