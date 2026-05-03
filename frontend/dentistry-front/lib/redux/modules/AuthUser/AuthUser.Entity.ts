import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { GetAuthClientAction } from "./actions/GetAuthClient/GetAuthClient";
import { GetAuthWorkerAction } from "./actions/GetAuthWorker/GetAuthWorker";
import { LogoutAuthWorkerAction } from "./actions/logoutAuthWorker/LogoutAuthWorker";

export enum AuthActionSaga {
  GetAuthClient = "Auth/getAuthClient",
  GetAuthWorker = "Auth/getAuthWorker",
  logoutWorker = "Auth/logoutWorker",
}

@EntityReducer(EntitiesRedux.Auth)
export class AuthEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Auth, {});
  }

  static schema = new AuthEntity(null).getSchema();

  *getAuthClientSaga(action: GetAuthClientAction) {
    yield call(this.xRead.bind(this), `/clients/me`, ActionReducer.Get);
  }
  *logoutAuthWorkerSaga(action: LogoutAuthWorkerAction) {
    yield call(
      this.xSave.bind(this),
      `/auth/logoutWorker`,
      undefined,
      ActionReducer.Post,
    );
  }

  *getAuthWorkerSaga(action: GetAuthWorkerAction) {
    yield call(this.xRead.bind(this), `/workers/me`, ActionReducer.Get);
  }

  *watch() {
    yield takeLatest(
      AuthActionSaga.GetAuthClient,
      this.getAuthClientSaga.bind(this),
    );
    yield takeLatest(
      AuthActionSaga.GetAuthWorker,
      this.getAuthWorkerSaga.bind(this),
    ); yield takeLatest(
      AuthActionSaga.logoutWorker,
      this.logoutAuthWorkerSaga.bind(this),
    );
  }
}
