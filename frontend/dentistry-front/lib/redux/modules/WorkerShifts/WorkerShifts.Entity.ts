import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { schema } from "normalizr";
import { ShiftsWorkerAction } from "./actions/GetShiftsToWorker/GetShiftsToWorker";
import { CreateWorkerShifts } from "./actions/CreateWorkerShifts/CreateWorkerShifts";
import { DeleteWorkerShifts } from "./actions/DeleteWorkerShifts/CreateWorkerShifts";
import { GetAllShiftsWorkersAction } from "./actions/GetShiftsToWorkers/GetShiftsToWorkers";

export enum WorkerShiftsActionSaga {
  GetShiftsToWorker = "workerShifts/GetShiftsToWorker",
  GetAllShiftsWorkers = "workerShifts/GetAll",
  CreateShift = "workerShifts/create",
  RemoveShift = "workerShifts/remove",
}

@EntityReducer(EntitiesRedux.WorkerShifts)
export class WorkerShiftsEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.WorkerShifts, {
      worker: new schema.Entity(EntitiesRedux.Workers),
    });
  }
  // Статичне поля для отримання схеми
  static schema = new WorkerShiftsEntity(null).getSchema();

  *getShiftsToWorkerSaga(action: ShiftsWorkerAction) {
    const { idWorker } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/worker-shifts/${idWorker}/shifts`,
      ActionReducer.Get,
    );
  }

  *CreateWorkerShiftsSaga(action: CreateWorkerShifts) {
    const payload = action.payload;

    yield call(
      this.xSave.bind(this),
      `/worker-shifts/create`,
      payload,
      ActionReducer.Post,
    );
  }

  *RemoveWorkerShiftsSaga(action: DeleteWorkerShifts) {
    const { id } = action.payload;
    yield call(
      this.xDelete.bind(this),
      `/worker-shifts/${id}`,
      id,
      ActionReducer.Delete,
    );
  }

  // Сага для отримання всіх змін по стоматології
  *getAllShiftsWorkersSaga(action: GetAllShiftsWorkersAction) {
    const { idDentisty, take,skip } = action.payload;
    let url = `/worker-shifts/clinic/${idDentisty}?`;
    if (typeof take !== "undefined") {
      url += `&take=${take}`;
    }
     if (typeof skip !== "undefined") {
      url += `&skip=${skip}`;
    }
    yield call(this.xRead.bind(this), url, ActionReducer.Get);
  }

  *watch() {
    yield takeLatest(
      WorkerShiftsActionSaga.GetShiftsToWorker,
      this.getShiftsToWorkerSaga.bind(this),
    );

    yield takeLatest(
      WorkerShiftsActionSaga.CreateShift,
      this.CreateWorkerShiftsSaga.bind(this),
    );

    yield takeLatest(
      WorkerShiftsActionSaga.RemoveShift,
      this.RemoveWorkerShiftsSaga.bind(this),
    );

    yield takeLatest(
      WorkerShiftsActionSaga.GetAllShiftsWorkers,
      this.getAllShiftsWorkersSaga.bind(this),
    );
  }
}
