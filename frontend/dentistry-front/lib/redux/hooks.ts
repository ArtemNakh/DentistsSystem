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
import React from "react";

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


// версія 1
// export function TestuseAppSelector<T>(
//   selector: (state: RootState) => any,
// ): T {
//   return useSelector((state: RootState) => {
//     const slice = selector(state);

//     const sliceName = Object.keys(state).find(
//       (key) => (state as any)[key] === slice
//     );

//     const schemas = getEntitySchemas();
//     const schema = sliceName ? schemas[sliceName] : undefined;

//     // якщо немає схеми або slice не є словником — повертаємо slice напряму
//     if (!schema || typeof slice !== "object" || Array.isArray(slice) || "user" in slice) {
//       return slice as T;
//     }

//     // якщо є схема і slice виглядає як словник сутностей
//     return Object.keys(slice ?? {})
//       .map((id) => denormalize(Number(id), schema, state))
//       .filter(Boolean) as T;
//   });
// }

// версія 2
export function TestuseAppSelector<T>(
  selector: (state: RootState) => any,
): T {
  const state = useSelector((s: RootState) => s);
  const slice = selector(state);

  const sliceName = Object.keys(state).find(
    (key) => (state as any)[key] === slice
  );

  const schemas = getEntitySchemas();
  const schema = sliceName ? schemas[sliceName] : undefined;

  return React.useMemo(() => {
    if (!schema || typeof slice !== "object" || Array.isArray(slice) || "user" in slice) {
      return slice as T;
    }
    return Object.keys(slice ?? {})
      .map((id) => denormalize(Number(id), schema, state))
      .filter(Boolean) as T;
  }, [slice, schema, state]);
}

