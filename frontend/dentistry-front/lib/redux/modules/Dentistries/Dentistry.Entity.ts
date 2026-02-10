import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";

export enum DentistryActionSaga {
  GetDentistry = "dentistry/getSaga",
}

@EntityReducer(EntitiesRedux.Dentistries)
export class DentistryEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Dentistries, {});
  }

  *getDentistrySaga() {
    yield call(this.xRead.bind(this), `/dentistries/test/all`, ActionReducer.Get);
  }

  *watch() {
      yield takeLatest(DentistryActionSaga.GetDentistry, this.getDentistrySaga.bind(this));
      }
}
