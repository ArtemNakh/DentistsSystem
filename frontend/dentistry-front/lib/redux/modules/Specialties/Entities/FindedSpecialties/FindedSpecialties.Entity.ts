import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../../../BaseEntity";
import { EntityReducer } from "../../../EntityReducer";
import { ActionReducer } from "@/lib/redux/rootReducer";

import { GetSpecialtiesByName, GetSpecialtiesByNamePayload } from "./actions/GetSpecialtiesByFIO/GetSpecialtiesByFIO";

export enum FindingSpecialtyActionSaga {
  GetSpecialtiesByName = "findingSpecialties/GetByName",
}

@EntityReducer(EntitiesRedux.FindingSpecialties)
export class FindingSpecialtyEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.FindingSpecialties, {});
  }
static schema = new FindingSpecialtyEntity(null).getSchema();
  
  *GetByNameSaga(action: GetSpecialtiesByName) {
    yield call(
      this.xRead.bind(this), // для GET краще xRead
      `/specialties/search?search=${action.payload.name}&dentistryId=${action.payload.dentistryId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      FindingSpecialtyActionSaga.GetSpecialtiesByName,
      this.GetByNameSaga.bind(this),
    );
  }
}
