import BaseEntity, { EntitiesRedux } from "@/lib/redux/modules/BaseEntity";
import { EntityReducer } from "@/lib/redux/modules/EntityReducer";
import { ActionReducer } from "@/lib/redux/rootReducer";
import { schema } from "normalizr";
import { call, takeLatest } from "redux-saga/effects";

export interface IWorkerWeekend {
  id: number;
  worker: any;
  weekend_days: number;
  created_at: Date;
  updated_at: Date;
}

export enum WorkerWeekendActionSaga {
  GetWorkersWeekend = "WorkerWeekend/getByDentistry",
}

export const GetNumbersWorkersWeekend = (payload: { dentistryId: number }) => ({
  type: WorkerWeekendActionSaga.GetWorkersWeekend,
  payload,
});

export type GetWorkersWeekendAction = ReturnType<typeof GetNumbersWorkersWeekend>;

const specialtySchema = new schema.Entity(EntitiesRedux.Specialties);
// Схема для worker з specialties
const workerSchema = new schema.Entity(
  EntitiesRedux.Workers,
  {
    specialty: new schema.Entity(EntitiesRedux.Specialties), // додаємо вкладену сутність
  },
  {
    idAttribute: (entity: any) => `${entity.id}`,
  },
);
const workerWeekendSchema = new schema.Entity(
  EntitiesRedux.WorkersWeekend,
  { worker: workerSchema },
  { idAttribute: (entity: any) => `${entity.worker.id}` },
);
@EntityReducer(EntitiesRedux.WorkersWeekend)
export class WorkerWeekendEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.WorkersWeekend, { worker: workerSchema });
    (this as any).schema = workerWeekendSchema;
  }

  *getWorkersWeekendSaga(action: GetWorkersWeekendAction) {
    const { dentistryId } = action.payload;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    yield call(
      this.xRead.bind(this),
      `/worker-shifts/${dentistryId}?start=${startStr}&end=${endStr}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      WorkerWeekendActionSaga.GetWorkersWeekend,
      this.getWorkersWeekendSaga.bind(this),
    );
  }
}
