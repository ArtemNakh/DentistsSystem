// rootReducer.ts
import { combineReducers } from "redux";
import { entitiesRegistry, reducersRegistry } from "./registry";

// export const rootReducer = combineReducers(
//   // reducersRegistry
//   Object.keys(reducersRegistry).length > 0
//     ? reducersRegistry
//     : { _empty: (state = {}) => state },
// );

// створюємо дефолтні редʼюсери для всіх сутностей

const defaultReducers = entitiesRegistry.reduce(
  (acc, name) => {
    acc[name] = (state = {}) => state;
    return acc;
  },
  {} as Record<string, any>,
);
export const rootReducer = combineReducers({
  ...defaultReducers,
  ...reducersRegistry,
});
