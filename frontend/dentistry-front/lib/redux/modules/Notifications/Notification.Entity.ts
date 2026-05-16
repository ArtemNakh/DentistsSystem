import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { schema } from "normalizr";

export enum NotificationActionSaga {}

@EntityReducer(EntitiesRedux.Notifications)
export class NotificationEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Notifications, {
      appointment: new schema.Entity(EntitiesRedux.Appointments, {
        client: new schema.Entity(EntitiesRedux.Clients),
        dentist: new schema.Entity(EntitiesRedux.Workers, {
          specialty: new schema.Entity(EntitiesRedux.Specialties),
          dentistry: new schema.Entity(EntitiesRedux.Dentistries),
        }),
        appointment_actions: [
          new schema.Entity(EntitiesRedux.AppointmentActions, {
            operation: new schema.Entity(EntitiesRedux.OperationList, {
              dental_clinic: new schema.Entity(EntitiesRedux.Dentistries),
            }),
          }),
        ],
        payment: new schema.Entity(EntitiesRedux.Payments),
      }),
    });
  }
  static schema = new NotificationEntity(null).getSchema();

  *watch() {}
}
