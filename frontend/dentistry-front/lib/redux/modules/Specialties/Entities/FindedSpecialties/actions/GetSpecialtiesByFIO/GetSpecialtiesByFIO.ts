import { FindingSpecialtyActionSaga } from "../../FindedSpecialties.Entity";

export interface GetSpecialtiesByNamePayload {
  name: string;
  dentistryId:number;
}

export const GetSpecialtiesByName = (payload: GetSpecialtiesByNamePayload) => ({
  type: FindingSpecialtyActionSaga.GetSpecialtiesByName,
  payload,
});

export type GetSpecialtiesByName = ReturnType<typeof GetSpecialtiesByName>;
