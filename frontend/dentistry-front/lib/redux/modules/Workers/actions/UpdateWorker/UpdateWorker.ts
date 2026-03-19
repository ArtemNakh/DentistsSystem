import { WorkerActionSaga } from "../../Workers.Entity";

export interface UpdateWorkerPayload {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  birthday: string;
  phone: string;
  specialtyId: number;
  dentistryId: number;
  login: string;
  password: string;
  active:boolean;
}

export const UpdateWorker = (payload: UpdateWorkerPayload) => ({
  type: WorkerActionSaga.UpdateWorker,
  payload,
});

export type UpdateWorkerAction = ReturnType<typeof UpdateWorker>;
