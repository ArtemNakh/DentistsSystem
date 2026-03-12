import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";
import { ShiftsWorkerAction } from "./actions/GetShiftsToWorker/GetShiftsToWorker";

export enum WorkerShiftsActionSaga {
  GetShiftsToWorker = "workerShifts/GetShiftsToWorker",
}

@EntityReducer(EntitiesRedux.WorkerShifts)
export class WorkerShiftsEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.WorkerShifts, {
      worker: new schema.Entity(EntitiesRedux.Workers),
    });
  }

  *getShiftsToWorkerSaga(action: ShiftsWorkerAction) {
    const { idWorker } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/worker-shifts/${idWorker}/shifts`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      WorkerShiftsActionSaga.GetShiftsToWorker,
      this.getShiftsToWorkerSaga.bind(this),
    );
  }
}
