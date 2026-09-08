import { WorkerActionSaga } from "../../Workers.Entity";

export const GetWorkerById = (payload: { id: number }) => ({
  type: WorkerActionSaga.GetWorkerById,
  payload,
});

export type GetWorkerByIdAction = ReturnType<typeof GetWorkerById>;
