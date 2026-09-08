import { SpecialtyActionSaga } from "../../Specialties.Entity";
import { SpecialtyType } from "../../Specialties.interface";

export interface CreateSpecialtyPayload {
  name: string;
  description?: string;
  type: SpecialtyType;
}

export const CreateSpecialty = (payload: CreateSpecialtyPayload) => ({
  type: SpecialtyActionSaga.CreateSpecialty,
  payload,
});

export type CreateSpecialty = ReturnType<typeof CreateSpecialty>;
