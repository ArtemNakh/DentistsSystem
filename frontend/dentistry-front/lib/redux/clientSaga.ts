import { call, put, takeLatest } from "redux-saga/effects";
import { normalize, schema } from "normalizr";
import { PayloadAction } from "@reduxjs/toolkit";
import { CallEffect, PutEffect } from "redux-saga/effects";

export enum ClientActionSaga {
  AddClient = "client/addClientSaga",
  GetClients = "client/fetchClientsSaga",
}
const clientSchema = new schema.Entity("clients");

async function requestToDB(endpoint: string, method: string, data?: any) {
  const res = await fetch(`http://localhost:4000/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(data && { body: JSON.stringify(data) }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}

function* getClientsSaga(
  action: PayloadAction<void>,
): Generator<CallEffect<any> | PutEffect<any>, void, any> {
  try {
    const result: any = yield call(requestToDB, "clients/test/all", "GET");
    const normalized = normalize(result, [clientSchema]);
    yield put({ type: "GET", payload: normalized });
  } catch (error: any) {
    console.error("Get clients error:", error);
  }
}

function* addClientSaga(
  action: PayloadAction<any>,
): Generator<CallEffect<any> | PutEffect<any>, void, any> {
  try {
    const result: any = yield call(
      requestToDB,
      "clients/add",
      "POST",
      action.payload,
    );
    const normalized = normalize(result, clientSchema);
    yield put({ type: "POST", payload: normalized });
  } catch (error: any) {
    console.error("Add client error:", error);
  }
}

export function* clientsWatch() {
  yield takeLatest(ClientActionSaga.GetClients, getClientsSaga);
  yield takeLatest(ClientActionSaga.AddClient, addClientSaga);
}
