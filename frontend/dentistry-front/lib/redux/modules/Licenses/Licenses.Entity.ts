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
import { GetLicensesWorker } from "./actions/GetLicensesWorker/GetLicensesWorker";
import { GetExpirationByDentistryAction } from "./actions/GetExpirationByDentistry/GetExpirationByDentistry";
import { GetExpirationByWorkerAction } from "./actions/GetExpirationByWorker/GetExpirationByWorker";

export enum LicensesActionSaga {
  GetLicensesWorkers = "licenses/getToWorkers",
  CreateLicense = "licenses/create",
  RemoveLicense = "licenses/remove",
  GetByIdWorker = "licenses/GetLicensesWorker",
  GetExpirationByDentistry = "licenses/GetExpirationDentistry",
  GetExpirationLicensesWorker = "licenses/GetExpirationWorker",
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
  static schema = new LicensesEntity(null).getSchema();

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
    yield call(
      this.xDelete.bind(this),
      `/license/${id}`,
      id,
      ActionReducer.Delete,
    );
  }

  *GetLicencesWorkerByIdSaga(action: GetLicensesWorker) {
    const { workerId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/license/worker/${workerId}`,
      ActionReducer.Get,
    );
  }

  *getExpiringLicensesDentistrySaga(action: GetExpirationByDentistryAction) {
    const { dentistryId, maxDays } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/license/expiring-licenses-dentistry?dentistryId=${dentistryId}&maxDays=${maxDays}`,
      ActionReducer.Get,
    );
  }
  *getExpiringLicensesWorkerSaga(action: GetExpirationByWorkerAction) {
    const { workerId, maxDays } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/license/expiring-licenses-worker?dentistryId=${workerId}&maxDays=${maxDays}`,
      ActionReducer.Get,
    );
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

    yield takeLatest(
      LicensesActionSaga.GetByIdWorker,
      this.GetLicencesWorkerByIdSaga.bind(this),
    );

    yield takeLatest(
      LicensesActionSaga.GetExpirationByDentistry,
      this.getExpiringLicensesDentistrySaga.bind(this),
    );

    yield takeLatest(
      LicensesActionSaga.GetExpirationLicensesWorker,
      this.getExpiringLicensesWorkerSaga.bind(this),
    );
  }
}
