import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { GetAuthClientAction } from "./actions/GetAuthClient/GetAuthClient";
import { GetAuthWorkerAction } from "./actions/GetAuthWorker/GetAuthWorker";
import { LogoutAuthWorkerAction } from "./actions/logoutAuthWorker/LogoutAuthWorker";
import { ResetPasswordClientAction } from "./actions/ResetPasswordClient/ResetPasswordClient";
import { SetNewPasswordClientAction } from "./actions/SetNewPasswordClient/SetNewPasswordClient";

export enum AuthActionSaga {
  GetAuthClient = "Auth/getAuthClient",
  GetAuthWorker = "Auth/getAuthWorker",
  logoutWorker = "Auth/logoutWorker",
  ResetPasswordClient = "Auth/resetPasswordClient",
  SetNewPasswordClient = "Auth/setNewPasswordClient",
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
    try {
      yield call(this.xRead.bind(this), `/workers/me`, ActionReducer.Get);
    } catch (error) {
      // якщо 401 або інша помилка — нічого не додаємо в Redux
      console.log("Auth check failed:", error);
    } // yield call(this.xRead.bind(this), `/workers/me`, ActionReducer.Get);
  }

  *ResetPasswordClientSaga(action: ResetPasswordClientAction) {
    yield call(
      this.xSave.bind(this),
      `/password-recovery/reset-password`,
      action.payload,
      undefined,
    );
  }

  *SetNewPasswordClientSaga(action: SetNewPasswordClientAction) {
    const { token, password } = action.payload;
    console.log("token12",token)
    yield call(
      this.xSave.bind(this),
      `/password-recovery/new/` + token ,
      { password },
      undefined,
    );
  }

  *watch() {
    yield takeLatest(
      AuthActionSaga.GetAuthClient,
      this.getAuthClientSaga.bind(this),
    );
    yield takeLatest(
      AuthActionSaga.GetAuthWorker,
      this.getAuthWorkerSaga.bind(this),
    );
    yield takeLatest(
      AuthActionSaga.logoutWorker,
      this.logoutAuthWorkerSaga.bind(this),
    );
    yield takeLatest(
      AuthActionSaga.ResetPasswordClient,
      this.ResetPasswordClientSaga.bind(this),
    );
    yield takeLatest(
      AuthActionSaga.SetNewPasswordClient,
      this.SetNewPasswordClientSaga.bind(this),
    );
  }
}
