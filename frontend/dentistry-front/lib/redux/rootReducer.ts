// rootReducer.ts
import { combineReducers } from "redux";
import { reducersRegistry } from "./registry";

export const rootReducer = combineReducers(reducersRegistry);
