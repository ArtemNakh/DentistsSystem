import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { schema } from "normalizr";
import {
  getAllNotificationTodayAction,
  GetAllNotificationTodayPayload,
} from "./actions/GetAllToday/GetAllToday";
import { format } from "date-fns";
import { ActionReducer } from "../../rootReducer";
import { call, takeLatest } from "redux-saga/effects";

export enum NotificationActionSaga {
  "getAllToday" = "notification/getAllToday",
}

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

  *GetAllTodaySaga(action: getAllNotificationTodayAction) {
    const { dentistryId } = action.payload;
    const today = format(new Date(), "yyyy-MM-dd");

    yield call(
      this.xRead.bind(this),
      `/notification/all?date=${today}&dentistryId=${dentistryId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      NotificationActionSaga.getAllToday,
      this.GetAllTodaySaga.bind(this),
    );
  }
}
