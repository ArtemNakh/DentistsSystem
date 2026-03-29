import { WorkerShiftsActionSaga } from "../../WorkerShifts.Entity";

interface DeleteShiftsWorkerPayload {
    id: number;
}

export const DeleteShiftsWorker = (payload: DeleteShiftsWorkerPayload) => ({
  type: WorkerShiftsActionSaga.RemoveShift,
  payload,
});

export type DeleteWorkerShifts = ReturnType<typeof DeleteShiftsWorker>;
