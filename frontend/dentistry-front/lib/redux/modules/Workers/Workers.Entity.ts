import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";
import { WorkersDentistryAction } from "./actions/GetWorkersDentistry/GetWorkersDentistry";
import { SaveWorkersToReduxAction } from "./actions/SaveWorkersRedux/SaveWorkersToRedux";
import { CreateWorkerAction } from "./actions/CreateWorker/CreateWorker";

export enum WorkerActionSaga {
  GetWorkersDentistry = "Worker/getByDentistry",
  SaveWorkers = "Worker/saveWorkers",
  CreateWorker = "Worker/create",
}

@EntityReducer(EntitiesRedux.Workers)
export class WorkerEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Workers, {
      specialty: new schema.Entity(EntitiesRedux.Specialties),
      dentistry: new schema.Entity(EntitiesRedux.Dentistries),
    });
  }

  *getDoctorsDentistSaga(action: WorkersDentistryAction) {
    const { idDentistry } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/workers/all/doctors?dentistry=${idDentistry}`,
      ActionReducer.Get,
    );
  }

  *saveWorkersSaga(action: SaveWorkersToReduxAction) {
    const { payload } = action; // Викликаємо ActionRedux напряму, щоб задиспатчити дані у Redux
    yield call(this.ActionRedux.bind(this), payload, ActionReducer.Get);
  }

  *CreateWorkerSaga(action: CreateWorkerAction) {
    yield call(
      this.xSave.bind(this),
      `/workers/create`,
      action.payload,
      ActionReducer.Post,
    );
  }
  *watch() {
    yield takeLatest(
      WorkerActionSaga.GetWorkersDentistry,
      this.getDoctorsDentistSaga.bind(this),
    );
    yield takeLatest(
      WorkerActionSaga.SaveWorkers,
      this.saveWorkersSaga.bind(this),
    );
    yield takeLatest(
      WorkerActionSaga.CreateWorker,
      this.CreateWorkerSaga.bind(this),
    );
  }
}
