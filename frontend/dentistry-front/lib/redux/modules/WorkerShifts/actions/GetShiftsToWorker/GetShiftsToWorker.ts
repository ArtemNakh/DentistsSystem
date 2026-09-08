import { WorkerShiftsActionSaga } from "../../WorkerShifts.Entity";

interface GetShiftsWorkerPayload {
  idWorker: number;
}

export const getShiftsWorker = (payload: GetShiftsWorkerPayload) => ({
  type: WorkerShiftsActionSaga.GetShiftsToWorker,
  payload,
});

export type ShiftsWorkerAction = ReturnType<typeof getShiftsWorker>;