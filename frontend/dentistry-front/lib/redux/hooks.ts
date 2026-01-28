import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, store } from "./store";

// Кастомний dispatch з типами
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Кастомний selector з типами

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
