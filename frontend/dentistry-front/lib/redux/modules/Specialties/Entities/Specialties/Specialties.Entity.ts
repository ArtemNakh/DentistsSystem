import BaseEntity, { EntitiesRedux } from "../../../BaseEntity";
import { EntityReducer } from "../../../EntityReducer";

export enum SpecialtyActionSaga {
  CreateSpecialty="Specialty/create"
}

@EntityReducer(EntitiesRedux.Specialties)
export class SpecialtyEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Specialties, {});
  }
static schema = new SpecialtyEntity(null).getSchema();
  
  *watch() {}
}
