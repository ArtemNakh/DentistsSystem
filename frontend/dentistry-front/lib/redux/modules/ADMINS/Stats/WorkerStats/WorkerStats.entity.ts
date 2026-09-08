import { call, takeLatest } from "redux-saga/effects";
import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../../../BaseEntity";
import { EntityReducer } from "../../../EntityReducer";
import { ActionReducer } from "@/lib/redux/rootReducer";
import { GetWorkersAppointmentStatsAction } from "./actions/GetWorkersStats/GetWorkersStats";

export enum WorkerStatsActionSaga {
  GetWorkersStats = "WorkerStats/getByDentistry",
}

const specialtySchema = new schema.Entity(EntitiesRedux.Specialties);

// Схема для worker з specialties
const workerSchema = new schema.Entity(
  EntitiesRedux.Workers,
  {
    specialty: specialtySchema, // додаємо вкладену сутність
  },
  {
    idAttribute: (entity: any) => `${entity.id}`,
  },
);

// Схема для статистики
const workerStatsSchema = new schema.Entity(
  EntitiesRedux.WorkerStats,
  { worker: workerSchema },
  { idAttribute: (entity: any) => `${entity.worker.id}` },
);




@EntityReducer(EntitiesRedux.WorkerStats)
export class WorkerStatsEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.WorkerStats, { worker: workerSchema });
    (this as any).schema = workerStatsSchema;
  }

  static schema = new WorkerStatsEntity(null).getSchema();

  *getWorkersStatsSaga(action: GetWorkersAppointmentStatsAction) {
    const { dentistryId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/workers-stats/${dentistryId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      WorkerStatsActionSaga.GetWorkersStats,
      this.getWorkersStatsSaga.bind(this),
    );
  }
}
