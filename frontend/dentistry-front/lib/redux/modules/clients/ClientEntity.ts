import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { ActionReducer } from "../../rootReducer";
import { call, takeLatest } from "redux-saga/effects";
import { GetClientAction } from "./actions/GetClients/GetClients";
import { AddClientAction } from "./actions/AddClient.ts/AddClient";
import { GetClientsByFullName } from "./actions/GetClientsByFullName/GetClientsByFullName";
import { UpdateClientAction } from "./actions/UpdateClient.ts/UpdateClient";

export enum ClientActionSaga {
  /**Додавання та зберігання нового відео */
  AddClient = "client/addClientSaga",
  /**Отримання та зберігання відео */
  GetClient = "client/fetchClientSaga",

  GetClientsByFullName = "client/getAllByFullName",
  UpdateClient = "client/updateClient",
}

@EntityReducer(EntitiesRedux.Clients)
export class ClientEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Clients, {});
  }

  static schema = new ClientEntity(null).getSchema();

  /**Get and save videos */
  *getClientSaga(action: GetClientAction) {
    yield call(this.xRead.bind(this), `/clients/test/all`, ActionReducer.Get);
  }

  /**Add and save video */
  *addClientSaga(action: AddClientAction) {
    yield call(
      this.xSave.bind(this),
      `/auth/registrationClient`,
      action.payload,
      ActionReducer.Post,
    );
  }

  *GetClientsByFullNameSaga(action: GetClientsByFullName) {
    yield call(
      this.xRead.bind(this), // для GET краще xRead
      `/clients/search?fio=${String(action.payload.fullName)}`,
      ActionReducer.Get,
    );
  }
  /**Add and save video */
  *updateClientSaga(action: UpdateClientAction) {
    yield call(
      this.xUpdate.bind(this),
      `/clients/update`,
      action.payload,
      ActionReducer.Update,
    );
  }
  /**Listener saga actions */
  *watch() {
    yield takeLatest(ClientActionSaga.GetClient, this.getClientSaga.bind(this));
    yield takeLatest(ClientActionSaga.AddClient, this.addClientSaga.bind(this));
    yield takeLatest(
      ClientActionSaga.GetClientsByFullName,
      this.GetClientsByFullNameSaga.bind(this),
    );
    yield takeLatest(
      ClientActionSaga.UpdateClient,
      this.updateClientSaga.bind(this),
    );
  }
}
