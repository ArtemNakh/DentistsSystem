import { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import {
  call,
  CallEffect,
  put,
  PutEffect,
  takeLatest,
} from "redux-saga/effects";
import { normalize, schema } from "normalizr";
import { Entity } from "../../registry";
import { IClient } from "./clients.interface";

// Екшени для саги та редʼюсера
export enum ClientActionSaga {
  AddClient = "client/addClientSaga",
  GetClients = "client/fetchClientsSaga",
}

export enum ClientActionReducer {
  Get = "GET",
  Post = "POST",
}

// Normalizr схема
const clientSchema = new schema.Entity("clients");
const clientsListSchema = [clientSchema];
export type ClientsState = Record<string, IClient>;

// Єдина сутність: і reducer, і saga
@Entity({ name: "Clients" })
export class ClientEntity {
  //   private initialState: Record<string, any> = {};
  private initialState: ClientsState = {};

  /** Reducer */
  public reducer = (
    state: ClientsState = this.initialState,
    action: any,
  ): ClientsState => {
    switch (action.type) {
      case ClientActionReducer.Get:
      case ClientActionReducer.Post: {
        const newEntities = action.payload.entities?.clients as
          | Record<string, IClient>
          | undefined;
        if (!newEntities) return state;

        return {
          ...state,
          ...Object.entries(newEntities).reduce((acc, [id, rawData]) => {
            acc[id] = { ...state[id], ...(rawData as IClient) };
            return acc;
          }, {} as ClientsState),
        };
      }
      default:
        return state;
    }
  };

  /** Запит до API */
  private async requestToDB(endpoint: string, method: string, data?: any) {
    const res = await fetch(`http://localhost:4000/${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(data && { body: JSON.stringify(data) }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  }

  /** Saga: отримати клієнтів */
  public *getClientsSaga(
    action: PayloadAction<void>,
  ): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
    try {
      const result: any = yield call(
        this.requestToDB,
        "clients/test/all",
        "GET",
      );
      const normalized = normalize(result, clientsListSchema);
      yield put({ type: ClientActionReducer.Get, payload: normalized });
    } catch (error) {
      console.error("Get clients error:", error);
    }
  }

  /** Saga: додати клієнта */
  public *addClientSaga(
    action: PayloadAction<any>,
  ): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
    try {
      const result: any = yield call(
        this.requestToDB,
        "clients/add",
        "POST",
        action.payload,
      );
      const normalized = normalize(result, clientSchema);
      yield put({ type: ClientActionReducer.Post, payload: normalized });
    } catch (error) {
      console.error("Add client error:", error);
    }
  }

  /** Watcher */
  public *watch() {
    yield takeLatest(
      ClientActionSaga.GetClients,
      this.getClientsSaga.bind(this),
    );
    yield takeLatest(ClientActionSaga.AddClient, this.addClientSaga.bind(this));
  }
}
export const clientReducer = new ClientEntity().reducer;