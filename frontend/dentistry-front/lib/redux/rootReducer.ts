// rootReducer.ts
import { combineReducers } from "redux";
import { entitiesRegistry, reducersRegistry } from "./registry";
// import {
//   ClientActionReducer,
//   clientReducer,
// } from "./modules/clients/ClientEntity";

// // створюємо дефолтні редʼюсери для всіх сутностей
const defaultReducers = entitiesRegistry.reduce(
  (acc, name) => {
    acc[name] = (state = {}) => state;
    return acc;
  },
  {} as Record<string, any>,
);
// export const rootReducer = combineReducers({
//  ...defaultReducers,
//  ...reducersRegistry,
// });
const safeReducers =
  Object.keys(reducersRegistry).length > 0
    ? { ...defaultReducers, ...reducersRegistry }
    : { __empty: (state = {}) => state };
export const rootReducer = combineReducers(safeReducers);
// export const rootReducer = combineReducers({
//   Clients: clientReducer,
// });
