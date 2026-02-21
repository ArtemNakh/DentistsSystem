import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";

export enum WorkerActionSaga {
  GetWorker = "Worker/getSaga",
  GetWorkersDentistry = "Worker/getByDentistry",
}

// інтерфейси для payload
interface GetWorkerDentistryPayload {
  idDentistry: number;
}
interface GetWorkerClientPayload {
  id: number;
} // union для всіх можливих екшенів
export type WorkerActions =
  | {
      type: WorkerActionSaga.GetWorkersDentistry;
      payload: GetWorkerDentistryPayload;
    }
  | { type: WorkerActionSaga.GetWorker; payload: GetWorkerClientPayload };

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

  *getDoctorsDentistSaga(
    action: Extract<
      WorkerActions,
      { type: WorkerActionSaga.GetWorkersDentistry }
    >,
  ) {
    const { idDentistry } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/workers/all/doctors?dentistry=${idDentistry}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(WorkerActionSaga.GetWorker, this.getWorkerSaga.bind(this));
    yield takeLatest(
      WorkerActionSaga.GetWorkersDentistry,
      this.getDoctorsDentistSaga.bind(this),
    );
  }
}
