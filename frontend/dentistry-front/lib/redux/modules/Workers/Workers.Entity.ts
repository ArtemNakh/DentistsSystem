import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";

export enum WorkerActionSaga {
  GetWorker = "Worker/getSaga",
}

@EntityReducer(EntitiesRedux.Workers)
export class WorkerEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Workers, {
      specialty: new schema.Entity(EntitiesRedux.Specialties),
      dentistry: new schema.Entity(EntitiesRedux.Dentistries),
    });
  }

  *getWorkerSaga() {
    yield call(this.xRead.bind(this), `/workers/test/all`, ActionReducer.Get);
  }

  *watch() {
    yield takeLatest(WorkerActionSaga.GetWorker, this.getWorkerSaga.bind(this));
  }
}
