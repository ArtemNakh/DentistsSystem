import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";

export enum OperationListActionSaga {
 }

@EntityReducer(EntitiesRedux.OperationList)
export class OperationListEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.OperationList, {
      dental_clinic: new schema.Entity(EntitiesRedux.Dentistries),
      appointment_action: [new schema.Entity(EntitiesRedux.AppointmentActions)],
    });
  }

  static schema = new OperationListEntity(null).getSchema();
  

  *watch() {
  
  }
}
