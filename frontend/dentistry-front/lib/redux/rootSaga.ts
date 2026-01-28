
// rootSaga.ts
import { all } from "redux-saga/effects";
import { sagasRegistry } from "./registry";

export function* rootSaga() {
  yield all(sagasRegistry.map((entity) => entity.watch()));
}
