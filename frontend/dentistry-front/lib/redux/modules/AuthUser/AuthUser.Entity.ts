import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";

export enum AuthActionSaga {
  GetAuthClient = "Auth/getAuthClient",
  GetAuthWorker = "Auth/getAuthWorker",
}

interface GetAuthUserPayload {}

export type AuthUserActions =
  | {
      type: AuthActionSaga.GetAuthClient;
      payload: GetAuthUserPayload;
    }
  | {
      type: AuthActionSaga.GetAuthWorker;
      payload: GetAuthUserPayload;
    };

@EntityReducer(EntitiesRedux.Auth)
export class AuthEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Auth, undefined);
  }

  *getAuthClientSaga() {
    yield call(this.xRead.bind(this), `/clients/me`, ActionReducer.Get);
  }

  *getAuthWorkerSaga() {
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
    );
  }
}
