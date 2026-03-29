import { WorkerShiftsActionSaga } from "../../WorkerShifts.Entity";

interface GetShiftsWorkersPayload {
  idDentisty: number;
}

export const getAllShiftsWorkers = (payload: GetShiftsWorkersPayload) => ({
  type: WorkerShiftsActionSaga.GetAllShiftsWorkers,
  payload,
});

export type GetAllShiftsWorkersAction = ReturnType<typeof getAllShiftsWorkers>;