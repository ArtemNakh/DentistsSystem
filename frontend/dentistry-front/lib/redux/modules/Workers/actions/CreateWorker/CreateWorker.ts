import { WorkerActionSaga } from "../../Workers.Entity";

export interface CreateWorkerPayload {
  name: string;
  surname: string;
  middle_name: string;
  birthday: string;
  phone: string;
  specialtyId: number;
  dentistryId: number;
  login: string;
  password: string;
}

export const CreateWorker = (payload: CreateWorkerPayload) => ({
  type: WorkerActionSaga.CreateWorker,
  payload,
});

export type CreateWorkerAction = ReturnType<typeof CreateWorker>;
