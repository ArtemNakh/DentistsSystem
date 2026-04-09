
import { DentistryActionSaga } from "../../FindingDentistry.Entity";

export interface GetDentistriesByCityPayload {
  city: string;
}

export const GetDentistriesByCity = (payload: GetDentistriesByCityPayload) => ({
  type: DentistryActionSaga.GetAllByCity as const,
  payload,
});

export type GetDentistriesByCityAction = ReturnType<typeof GetDentistriesByCity>;
