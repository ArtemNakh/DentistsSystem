// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, store } from "./store";

// // Кастомний dispatch з типами
// export const useAppDispatch = () => useDispatch<AppDispatch>();

// // Кастомний selector з типами

// export type RootState = ReturnType<typeof store.getState>;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// new
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

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