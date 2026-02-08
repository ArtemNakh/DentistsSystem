// rootReducer.ts
import { combineReducers } from "redux";
import { entitiesRegistry, reducersRegistry } from "./registry";
import { ClientActionReducer, clientReducer } from "./modules/clients/ClientEntity";

// // створюємо дефолтні редʼюсери для всіх сутностей
// const defaultReducers = entitiesRegistry.reduce(
//   (acc, name) => {
//     acc[name] = (state = {}) => state;
//     return acc;
//   },
//   {} as Record<string, any>,
// );
// export const rootReducer = combineReducers({
//   ...defaultReducers,
//   ...reducersRegistry,
// });

export const rootReducer = combineReducers({
  Clients: clientReducer,
});
