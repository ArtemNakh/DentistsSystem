// // // store.ts
// // import { configureStore } from "@reduxjs/toolkit";
// // import createSagaMiddleware from "redux-saga";
// // import { rootReducer } from "./rootReducer";
// // import { rootSaga } from "./rootSaga";

// // const sagaMiddleware = createSagaMiddleware();

// // export const store = configureStore({
// //   reducer: rootReducer,
// //   middleware: (getDefaultMiddleware) =>
// //     getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
// // });

// // sagaMiddleware.run(rootSaga);

// // export type RootState = ReturnType<typeof store.getState>;
// // export type AppDispatch = typeof store.dispatch;

// // new
// import {
//   applyMiddleware,
//   compose,
//   configureStore,
//   Dispatch,
//   EnhancedStore,
// } from "@reduxjs/toolkit";
// import createSagaMiddleware, { AnyAction, Task } from "redux-saga";
// // import ClientContextDI from "@/client/di/ClientContextDI";
// import ClientContextDI from "../di/ContextDt";
// import { createWrapper } from "next-redux-wrapper";
// // import { rootSaga } from "./ReduxSaga";
// import { rootSaga } from "./rootSaga";
// // import { startReducer } from "./BaseReducer";
// import { startReducer } from "./rootReducer";

// export interface SagaStore extends EnhancedStore<any, AnyAction> {
//   sagaTask?: Task;
// }

// export default class ReduxStore extends ClientContextDI {
//   private _store: EnhancedStore<any, AnyAction>;
//   public _wrapper: any;

//   public setStore(value: any) {
//     this._store = value;
//   }

//   public store() {
//     return this._store;
//   }

//   public get state() {
//     return this._store.getState();
//   }

//   public dispatch = (args: any): Dispatch => {
//     return this._store?.dispatch?.(args);
//   };

//   constructor(opts: any) {
//     super(opts);
//     const store = this.configureReduxStore();
//     this._store = store;
//   }

//   private configureReduxStore(initialState?: any) {
//     const makeStore = () => {
//       const middleware: any = [];
//       const enhancers: any = [];

//       const sagaMiddleware = createSagaMiddleware();
//       middleware.push(sagaMiddleware);

//       enhancers.push(applyMiddleware(...middleware));

//       // const sagaMiddleware = createSagaMiddleware();
//       const store: EnhancedStore<any, AnyAction> = configureStore({
//         reducer: startReducer,
//         preloadedState: initialState,
//         middleware: (getDefaultMiddleware) =>
//           getDefaultMiddleware({
//             thunk: false,
//           }).concat(sagaMiddleware),
//       });
//       (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
//       return store;
//     };
//     this._wrapper = createWrapper<EnhancedStore<any, AnyAction>>(makeStore, {
//       debug: true,
//     });

//     return this._wrapper;
//   }

//   getWrapper() {
//     return this._wrapper;
//   }
// }


// store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { startReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: startReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
