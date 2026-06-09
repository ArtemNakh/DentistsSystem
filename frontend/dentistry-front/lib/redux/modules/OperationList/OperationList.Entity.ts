import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { call, takeLatest } from "redux-saga/effects";
import { GetOperationListByDentistryAction } from "./actions/GetOperationListByDentistry/GetOperationListByDentistry";
import HTTPMethod from "http-method-enum";
import { addNOperationAction as addOperationAction } from "./actions/AddOperation/AddOperation";
import { UpdateOperationAction } from "./actions/UpdateOperation/UpdateOperation";
import { GetActiveOperationListByDentistryAction } from "./actions/GetActiveOperationListByDentistry/GetActiveOperationListByDentistry";

export enum OperationListActionSaga {
  GetAllOperationsByDentistry = "operation-list/GetAllByDentistry",
  AddOperation = "operation-list/AddNewOperation",
  UpdateOperation = "operation-list/UpdateOperation",
  GetAllActiveOperationsByDentistry="operation-list/GetAllActiveByDentistry",
}

@EntityReducer(EntitiesRedux.OperationList)
export class OperationListEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.OperationList, {
      dental_clinic: new schema.Entity(EntitiesRedux.Dentistries),
      appointment_action: [new schema.Entity(EntitiesRedux.AppointmentActions)],
    });
  }

  static schema = new OperationListEntity(null).getSchema();

  *getOperationsListByDentistrySaga(action: GetOperationListByDentistryAction) {
    const { dentistryId, take, skip } = action.payload;

    // базовий URL
    let url = `/operation-list/${dentistryId}?`;

    // додаємо параметри тільки якщо вони є
    if (typeof take !== "undefined") {
      url += `&take=${take}`;
    }
    if (typeof skip !== "undefined") {
      url += `&skip=${skip}`;
    }

    yield call(this.xRead.bind(this), url, ActionReducer.Get);
  }
  *getActiveOperationsListByDentistrySaga(action: GetActiveOperationListByDentistryAction) {
    const { dentistryId, take, skip } = action.payload;

    // базовий URL
    let url = `/operation-list/${dentistryId}?active=true`;

    // додаємо параметри тільки якщо вони є
    if (typeof take !== "undefined") {
      url += `&take=${take}`;
    }
    if (typeof skip !== "undefined") {
      url += `&skip=${skip}`;
    }

    yield call(this.xRead.bind(this), url, ActionReducer.Get);
  }

  *updateOperationSaga(action: UpdateOperationAction) {
    const { operationId, name, description, price, active } = action.payload;
    console.log("action", action.payload);
    yield call(
      this.xSave.bind(this),
      `/operation-list/${operationId}`,
      { name, description, price, active },
      ActionReducer.Update,
      HTTPMethod.PUT,
    );
  }

  *addNewOperationSaga(action: addOperationAction) {
    yield call(
      this.xSave.bind(this),
      `/operation-list/create`,
      action.payload,
      ActionReducer.Post,
    );
  }

  *watch() {
    yield takeLatest(
      OperationListActionSaga.GetAllOperationsByDentistry,
      this.getOperationsListByDentistrySaga.bind(this),
    );
  yield takeLatest(
      OperationListActionSaga.GetAllActiveOperationsByDentistry,
      this.getActiveOperationsListByDentistrySaga.bind(this),
    );
    yield takeLatest(
      OperationListActionSaga.AddOperation,
      this.addNewOperationSaga.bind(this),
    );
    yield takeLatest(
      OperationListActionSaga.UpdateOperation,
      this.updateOperationSaga.bind(this),
    );
  }
}
