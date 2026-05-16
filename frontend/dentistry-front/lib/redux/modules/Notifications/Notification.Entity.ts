import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";
import { SendRemindAppointmentAction } from "./actions/SendRemindAppointment/SendRemindAppointment";
import { SendRemindPaymentAction } from "./actions/SendRemindPayment/SendRemindPayment";
import { schema } from "normalizr";

export enum NotificationActionSaga {
  SendRemindAboutAppointment = "notification/remindAppointments",
  SendRemindPayment = "notification/remindPayment",
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

  *SendRemindAppointmentSaga(action: SendRemindAppointmentAction) {
    const { dentistryId } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/notification/${dentistryId}/remind-appointment`,
      ActionReducer.Post,
    );
  }

  *SendRemindPaymentSaga(action: SendRemindPaymentAction) {
    const { dentistryId } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/notification/${dentistryId}/remind-pay`,
      ActionReducer.Post,
    );
  }

  *watch() {
    yield takeLatest(
      NotificationActionSaga.SendRemindAboutAppointment,
      this.SendRemindAppointmentSaga.bind(this),
    );

    yield takeLatest(
      NotificationActionSaga.SendRemindPayment,
      this.SendRemindPaymentSaga.bind(this),
    );
  }
}
