import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";

export enum SpecialtyActionSaga {
  GetSpecialty = "Specialty/getSaga",
}

@EntityReducer(EntitiesRedux.Specialties)
export class SpecialtyEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Specialties, {});
  }

  *getSpecialtySaga() {
    yield call(this.xRead.bind(this), `/specialties/test/all`, ActionReducer.Get);
  }

  *watch() {
      yield takeLatest(SpecialtyActionSaga.GetSpecialty, this.getSpecialtySaga.bind(this));
      }
}
