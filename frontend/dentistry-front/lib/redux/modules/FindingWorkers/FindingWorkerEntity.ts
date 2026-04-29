import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import {
  GetWorkersByFullName,
  GetWorkersByFullNamePayload,
} from "./actions/GetWorkersByFIO/GetWorkersByFIO";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";

export enum FindingWorkersActionSaga {
  GetWorkersByFullName = "findingWorkers/getAllByFullName",
}

@EntityReducer(EntitiesRedux.FindingWorkers)
export class FindingWorkerEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.FindingWorkers, {
      specialty: new schema.Entity(EntitiesRedux.Specialties),
      dentistry: new schema.Entity(EntitiesRedux.Dentistries),
    });
  }
static schema = new FindingWorkerEntity(null).getSchema();
  
  *GetWorkersByFullNameSaga(action: GetWorkersByFullName) {
    yield call(
      this.xRead.bind(this), // для GET краще xRead
      `/workers/search?search=${action.payload.fullName}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      FindingWorkersActionSaga.GetWorkersByFullName,
      this.GetWorkersByFullNameSaga.bind(this),
    );
  }
}
