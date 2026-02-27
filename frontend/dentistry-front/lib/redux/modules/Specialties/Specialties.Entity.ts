import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";

export enum SpecialtyActionSaga {}

@EntityReducer(EntitiesRedux.Specialties)
export class SpecialtyEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Specialties, {});
  }

  *watch() {}
}
