// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, store } from "./store";

// // Кастомний dispatch з типами
// export const useAppDispatch = () => useDispatch<AppDispatch>();

// // Кастомний selector з типами

// export type RootState = ReturnType<typeof store.getState>;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// new
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { denormalize } from "normalizr";
import { AppointmentEntity } from "./modules/Appointments/Appointments.Entity";
import { getEntitySchemas } from "./modules/EntityReducer";

// import { AppDispatch, RootState } from "./store";
// import type { RootState, AppDispatch } from "./store";

// Кастомний хук для dispatch, який:
// - використовує useDispatch
// - автоматично має тип AppDispatch, тому IDE буде підказувати доступні дії
 export const useAppDispatch = () => useDispatch<any>();

// Кастомний хук для selector, який:
// - є типізованою версією useSelector
// - дозволяє витягувати дані з Redux з автопідказками по RootState
 export const useAppSelector: TypedUseSelectorHook<any> = useSelector;



 
export function TestuseAppSelector<T>(
  selector: (state: RootState) => any,
): T {
  return useSelector((state: RootState) => {
    const slice = selector(state); // наприклад state.appointments
     const sliceName = Object.keys(state).find(
      (key) => (state as any)[key] === slice
    );
    const schemas = getEntitySchemas();
    const schema = schemas[sliceName as string]; // автоматично беремо схему

    if (!schema) {
     console.warn(`Schema not found for slice: ${String(sliceName)}`);

      return [] as T;
    }

    return Object.keys(slice ?? {})
      .map((id) => denormalize(Number(id), schema, state))
      .filter(Boolean) as T;
  });
}