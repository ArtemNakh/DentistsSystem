import { call, takeLatest } from "redux-saga/effects";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { GetDentistriesByCityAction } from "./actions/GetDentistriesByCity/GetDentistriesByCity";
import { ActionReducer } from "../../rootReducer";

export enum DentistryActionSaga {
  GetAllByCity="dentistry/getAllByCity"
}

@EntityReducer(EntitiesRedux.FindingDentistries)
export class FindingDentistryEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.FindingDentistries, {});
  }
static schema = new FindingDentistryEntity(null).getSchema();
  
 *GetDentistriesByCitySaga(action: GetDentistriesByCityAction) {
  yield call(
    this.xRead.bind(this), // для GET краще xRead
    `/dental_clinics/search?city=${action.payload.city}`,
    ActionReducer.Get
  );
}


  /**Listener saga actions */
  *watch() {
   
      yield takeLatest(DentistryActionSaga.GetAllByCity, this.GetDentistriesByCitySaga.bind(this));
    
  }
}
