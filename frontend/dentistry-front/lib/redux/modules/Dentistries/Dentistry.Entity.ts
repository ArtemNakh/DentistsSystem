import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";

export enum DentistryActionSaga {}

@EntityReducer(EntitiesRedux.Dentistries)
export class DentistryEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Dentistries, {});
  }

  *watch() {}
}
