import { schema } from "normalizr";

import { GetActionsByTitle } from "./actions/GetActionByTitle/GetActionByTitle";
import { call, takeLatest } from "redux-saga/effects";
import { EntityReducer } from "../../EntityReducer";
import BaseEntity, { EntitiesRedux } from "../../BaseEntity";
import { ActionReducer } from "@/lib/redux/rootReducer";

export enum OperationListActionSaga {
  GettingActionsByTitle = "appointmentAction/getByTitle",
 }

@EntityReducer(EntitiesRedux.FindingOperationList)
export class FindingOperationListEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.FindingOperationList, {
      dental_clinic: new schema.Entity(EntitiesRedux.Dentistries),
      appointment_action: [new schema.Entity(EntitiesRedux.AppointmentActions)],
    });
  }
static schema = new FindingOperationListEntity(null).getSchema();
  
  *GetOperationListByTitleSaga(action: GetActionsByTitle) {
    yield call(
      this.xRead.bind(this), // для GET краще xRead
      `/operation-list/search?search=${action.payload.title}&active=true`,
      ActionReducer.Get,
    );
  }

  
  *watch() {
    yield takeLatest(
      OperationListActionSaga.GettingActionsByTitle,
      this.GetOperationListByTitleSaga.bind(this),
    );
  }
}
