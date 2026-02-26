import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { call, takeLatest } from "redux-saga/effects";
import { GetClientAction } from "./actions/GetClients/GetClients";
import { AddClientAction } from "./actions/AddClient.ts/AddClient";

export enum ClientActionSaga {
  /**Додавання та зберігання нового відео */
  AddClient = "client/addClientSaga",
  /**Отримання та зберігання відео */
  GetClient = "client/fetchClientSaga",
}

@EntityReducer(EntitiesRedux.Clients)
export class ClientEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Clients, {});
  }

  /**Get and save videos */
  *getClientSaga(action: GetClientAction) {
    yield call(this.xRead.bind(this), `/clients/test/all`, ActionReducer.Get);
  }

  /**Add and save video */
  *addClientSaga(action: AddClientAction) {
    yield call(this.xSave.bind(this), `clients/test/all`, ActionReducer.Post);
  }

  /**Listener saga actions */
  *watch() {
    yield takeLatest(ClientActionSaga.GetClient, this.getClientSaga.bind(this));
    yield takeLatest(ClientActionSaga.AddClient, this.addClientSaga.bind(this));
  }
}
