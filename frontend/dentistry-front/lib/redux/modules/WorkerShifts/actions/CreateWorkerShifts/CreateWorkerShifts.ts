import { WorkerShiftsActionSaga } from "../../WorkerShifts.Entity";

export interface CreateShiftsWorkerPayload {
  workerId: number;
  shift_date: string; // ISO string
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
}

export const CreateShiftsWorker = (payload: CreateShiftsWorkerPayload) => ({
  type: WorkerShiftsActionSaga.CreateShift,
  payload,
});

export type CreateWorkerShifts = ReturnType<typeof CreateShiftsWorker>;
