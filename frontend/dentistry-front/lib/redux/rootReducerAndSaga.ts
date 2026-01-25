import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { clientsReducer } from "./clientReducer";
import { clientsWatch } from "./clientSaga";


export const rootReducer = combineReducers({
  Clients: clientsReducer,
});

export function* rootSaga() {
  yield all([
    clientsWatch(),
    // інші саги
  ]);
}
