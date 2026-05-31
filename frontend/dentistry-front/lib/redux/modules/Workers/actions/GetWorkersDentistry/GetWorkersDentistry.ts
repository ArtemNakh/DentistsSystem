import { WorkerActionSaga } from "../../Workers.Entity";

interface GetWorkerDentistryPayload {
  idDentistry: number;
  take?: number;
  skip?: number;
}

export const getWorkersDentistry = (payload: GetWorkerDentistryPayload) => ({
  type: WorkerActionSaga.GetWorkersDentistry,
  payload,
});

export type WorkersDentistryAction = ReturnType<typeof getWorkersDentistry>;
