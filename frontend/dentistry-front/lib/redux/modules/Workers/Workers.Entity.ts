import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";
import { IWorker } from "./Workers.interface";

export enum WorkerActionSaga {
  GetWorker = "Worker/getSaga",
  GetWorkersDentistry = "Worker/getByDentistry",
  SaveWorkers = "Worker/saveWorkers",
}

// інтерфейси для payload
interface GetWorkerDentistryPayload {
  idDentistry: number;
}
interface GetWorkerClientPayload {
  id: number;
} // union для всіх можливих екшенів

// новий інтерфейс для збереження працівників
interface SaveWorkersPayload {
  workers: IWorker[]; // тут можна уточнити тип, наприклад IWorker[]
}

export type WorkerActions =
  | {
      type: WorkerActionSaga.GetWorkersDentistry;
      payload: GetWorkerDentistryPayload;
    }
  | { type: WorkerActionSaga.GetWorker; payload: GetWorkerClientPayload }
  | { type: WorkerActionSaga.SaveWorkers; payload: SaveWorkersPayload };

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

  *saveWorkersSaga(
    action: Extract<
      { type: WorkerActionSaga.SaveWorkers; payload: IWorker[] },
      { type: WorkerActionSaga.SaveWorkers }
    >,
  ) {
    
    const { payload } = action; // Викликаємо ActionRedux напряму, щоб задиспатчити дані у Redux
    yield call(this.ActionRedux.bind(this), payload, ActionReducer.Get);
  }

  // ActionRedux (викликати цей метод)

  *watch() {
    yield takeLatest(WorkerActionSaga.GetWorker, this.getWorkerSaga.bind(this));
    yield takeLatest(
      WorkerActionSaga.GetWorkersDentistry,
      this.getDoctorsDentistSaga.bind(this),
    );
    yield takeLatest(WorkerActionSaga.SaveWorkers, this.saveWorkersSaga.bind(this));
  }
}
