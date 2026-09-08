import { HYDRATE } from "next-redux-wrapper";
import { EntityReduxNames } from "./modules/EntityReducer";
import { combineReducers } from "redux";

/**Типи дій із redux */
export enum ActionReducer {
  Get = "GET",
  Post = "POST",
  Update = "UPDATE",
  Delete = "DELETE",
}

export const startReducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    // Створюємо копію поточного стану
    let nextState = {
      ...state,
    };

    // Отримуємо дані зі сторони дії, які потрібно "гідрувати" у стан
    const hydratedState = action.payload;

    // Проходимося по всіх редʼюсерах у поточному стані
    Object.keys(state).forEach((reducer) => {
      // Перевіряємо, чи є нові дані для цього редʼюсера у hydratedState
      if (hydratedState[reducer]) {
        let newValues: any = {};
        const newData = hydratedState[reducer];

        // Об'єднуємо старі дані з новими, пріоритет мають значення newData
        newValues = [state[reducer] ?? {}, newData ?? {}].reduce((r, o) => {
          Object.keys(o).forEach((k) => (r[k] = o[k]));
          return r;
        }, {});

        // Оновлюємо стан редʼюсера з новими значеннями
        nextState[reducer] = {
          ...nextState[reducer],
          ...newValues,
        };
      }
    });

    // Повертаємо обʼєднаний стан
    return { ...state, ...nextState };
  } else {
    //отримання усі entity
    const entitiesNames: string[] = Reflect.getMetadata(
      EntityReduxNames,
      Reflect,
    );

    //створення загального Map з усіма reducers
    const reducersMap = entitiesNames.reduce(
      (acc, name) => {
        acc[name] = BaseReducer(name);
        return acc;
      },
      {} as Record<string, any>,
    );

    //  Створюється rootReducer — загальний редюсер для всієї аплікації
    const rootReducer = combineReducers(reducersMap);

    //вилкик кожного reducer
    const result = rootReducer(state, action);
    return result;
  }
};

export const BaseReducer = (entityName: string) => {
  const initialState: Record<string, any> = {};

  return (state = initialState, action: any) => {
    switch (action.type) {
      case ActionReducer.Get:

      case ActionReducer.Post:
      case ActionReducer.Update: {
        const newEntities = action.payload.entities?.[entityName];
        if (!newEntities) {
          return state;
        }

        const updatedState = { ...state };

        for (const [id, rawData] of Object.entries(newEntities)) {
          updatedState[id] = {
            ...state[id],
            ...rawData!,
          };
        }

        //Прибрати(переробити щоб автоматичесаки було)
        if (entityName === "auth" && action.payload.result) {
          const currentId = action.payload.result;
          const currentUser = updatedState[currentId]; // залишаємо тільки user
          return { user: currentUser };
        }

        return updatedState;
      }

      case ActionReducer.Delete: {
        const idsToDelete = action.payload?.ids;
        if (!idsToDelete) {
          return state;
        }

        const updatedState = { ...state };
        idsToDelete.forEach((id: string | number) => {
          delete updatedState[id];
        });

        return updatedState;
      }
      default:
        return state;
    }
  };
};
