import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer, EntityReduxNames } from "../EntityReducer";

export enum AppointmentActionsActionSaga {}

@EntityReducer(EntitiesRedux.AppointmentActions)
export class AppointmentActionsEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.AppointmentActions, {
      appointment: new schema.Entity(EntitiesRedux.Appointments, {
        client: new schema.Entity(EntitiesRedux.Clients),
        dentist: new schema.Entity(EntitiesRedux.Workers, {
          specialty: new schema.Entity(EntitiesRedux.Specialties),
          dentistry: new schema.Entity(EntitiesRedux.Dentistries),
        }),
        appointment_actions: [
          new schema.Entity(EntitiesRedux.AppointmentActions, {
            operation: new schema.Entity(EntitiesRedux.OperationList, {
              dental_clinics: new schema.Entity(EntitiesRedux.Dentistries),
            }),
          }),
        ],
      }),
      //   operation:new schema.Entity(EntitiesRedux.)
    });
  }

  *watch() {}
}
