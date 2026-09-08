import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { RootState } from "./store";
import { denormalize } from "normalizr";
import { getEntitySchemas } from "./modules/EntityReducer";
import React from "react";


/**
 * Хук для отримання dispatch з типом any.
 * Використовується для відправки Redux-екшенів.
 *
 * @returns {any} Redux dispatch
 */
export const useAppDispatch = () => useDispatch<any>();


/**
 * Типізований useSelector для роботи з Redux state.
 * Використовується для вибірки даних зі стору.
 */
export const useAppSelector: TypedUseSelectorHook<any> = useSelector;


/**
 * Кастомний хук для вибірки та денормалізації даних зі стору Redux.
 *
 * @template T Тип даних, які повертаються після денормалізації.
 * @param selector Функція-селектор, яка отримує RootState і повертає slice.
 * @returns {T} Денормалізовані дані або slice як є.
 *
 * @example
 * // Використання для отримання масиву Appointment
 * const appointments = UseDenormalizeSelector<IAppointment[]>(
 *   (state: RootState) => state.appointments
 * );
 */
export function UseDenormalizeSelector<T>(
  selector: (state: RootState) => any,
): T {
  // беремо slice через селектор (підписка тільки на нього)
  const slice = useSelector(selector);

  // доступ до всього RootState
  const store = useStore<RootState>();
  const fullState = store.getState();

  const schemas = getEntitySchemas();

  // знаходимо назву slice
  const sliceName = Object.keys(fullState).find(
    (key) => (fullState as any)[key] === slice,
  );

  const schema = sliceName ? schemas[sliceName] : undefined;

  return React.useMemo(() => {
    if (
      !schema ||
      typeof slice !== "object" ||
      Array.isArray(slice) ||
      "user" in slice
    ) {
      return slice as T;
    }
    return Object.keys(slice ?? {})
      .map((id) => denormalize(Number(id), schema, fullState))
      .filter(Boolean) as T;
  }, [slice, schema, fullState]);
}
