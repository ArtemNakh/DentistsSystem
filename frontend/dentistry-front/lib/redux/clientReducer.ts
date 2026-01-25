import { AnyAction } from "@reduxjs/toolkit";

const initialState: Record<string, any> = {};

export const clientsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "GET":
    case "POST": {
      const newEntities = action.payload.entities?.clients;
      if (!newEntities) return state;

      const updatedState = { ...state };
      for (const [id, rawData] of Object.entries(newEntities)) {
        updatedState[id] = {
          ...state[id],
          ...rawData!,
        };
      }
      return updatedState;
    }
    default:
      return state;
  }
};
