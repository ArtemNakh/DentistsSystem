
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";

export enum DentistryActionSaga {
  GetAllByCity = "dentistry/getAllByCity",
}

@EntityReducer(EntitiesRedux.Dentistries)
export class DentistryEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Dentistries, {});
  }
static schema = new DentistryEntity(null).getSchema();
  
  /**Listener saga actions */
  *watch() {}
}
