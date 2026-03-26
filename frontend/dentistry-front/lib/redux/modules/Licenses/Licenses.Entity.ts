import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { GetLicensesWorkers } from "./actions/GetAllLicensesWorkers/GetAllLicensesWorkers";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";
import { CreateLicense } from "./actions/CreateLicense/CreateLicense";
import {
  RemoveLicense,
  RemoveLicensePayload,
} from "./actions/RemoveLicense/RemoveLicense";

export enum LicensesActionSaga {
  GetLicensesWorkers = "licenses/getToWorkers",
  CreateLicense = "licenses/create",
  RemoveLicense = "licenses/remove",
}

@EntityReducer(EntitiesRedux.Licenses)
export class LicensesEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Licenses, {
      worker: new schema.Entity(EntitiesRedux.Workers, {
        specialty: new schema.Entity(EntitiesRedux.Specialties),
      }),
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

  *CreateLicenseSaga(action: CreateLicense) {
    const payload = action.payload;

    yield call(
      this.xSave.bind(this),
      `/license/create`,
      payload,
      ActionReducer.Post,
    );
  }

  *RemoveLicenseSaga(action: RemoveLicense) {
    const { id } = action.payload;
    yield call(this.xDelete.bind(this), `/license/${id}`, id, ActionReducer.Delete);
  }
  *watch() {
    yield takeLatest(
      LicensesActionSaga.GetLicensesWorkers,
      this.GetLicensesWorkersSaga.bind(this),
    );

    yield takeLatest(
      LicensesActionSaga.CreateLicense,
      this.CreateLicenseSaga.bind(this),
    );

    yield takeLatest(
      LicensesActionSaga.RemoveLicense,
      this.RemoveLicenseSaga.bind(this),
    );
  }
}
