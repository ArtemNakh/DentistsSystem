import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { GetLicensesWorkers } from "./actions/GetAllLicensesWorkers/GetAllLicensesWorkers";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";

export enum LicensesActionSaga {
  GetLicensesWorkers = "licenses\getToWorkers",
}

@EntityReducer(EntitiesRedux.Licenses)
export class LicensesEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Licenses, {
      worker: new schema.Entity(EntitiesRedux.Workers),
    });
  }

  *GetLicensesWorkersSaga(action: GetLicensesWorkers) {
    const { dentistryId } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/license/dentistry/${dentistryId}`,
      ActionReducer.Get,
    );
  }
  *watch() {
    yield takeLatest(
      LicensesActionSaga.GetLicensesWorkers,
      this.GetLicensesWorkersSaga.bind(this),
    );
  }
}
