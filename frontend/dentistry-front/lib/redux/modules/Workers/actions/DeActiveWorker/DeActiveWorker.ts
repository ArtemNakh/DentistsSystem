import { WorkerActionSaga } from "../../Workers.Entity";

interface DeActiveWorkerPayload {
  idWorker: number;
}

export const deActiveWorker = (payload: DeActiveWorkerPayload) => ({
  type: WorkerActionSaga.DeActive,
  payload,
});

export type DeActiveWorkerAction = ReturnType<typeof deActiveWorker>;
