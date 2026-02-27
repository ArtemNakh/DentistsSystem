import { WorkerActionSaga } from "../../Workers.Entity";
import { IWorker } from "../../Workers.interface";

interface SaveWorkersPayload {
  workers: IWorker[]; 
}


export const saveWorkersToRedux = (payload: SaveWorkersPayload) => ({
  type: WorkerActionSaga.SaveWorkers,
  payload,
});

export type SaveWorkersToReduxAction = ReturnType<typeof saveWorkersToRedux>;