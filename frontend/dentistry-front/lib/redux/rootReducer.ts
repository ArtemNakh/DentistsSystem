// rootReducer.ts
import { combineReducers } from "redux";
import { reducersRegistry } from "./registry";

export const rootReducer = combineReducers(
  // reducersRegistry
  Object.keys(reducersRegistry).length > 0
    ? reducersRegistry
    : { _empty: (state = {}) => state },
);
