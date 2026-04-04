import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer, EntityReduxNames } from "../EntityReducer";
import { call, takeLatest } from "redux-saga/effects";
import { CompleteAppointmentActionsAction } from "./actions/actions/CompleteAppointmentActions/CompleteAppointmentActions";
import { ActionReducer } from "../../rootReducer";

export enum AppointmentActionsActionSaga {
  CompleteAppointmentActions = "appointmentAction/completeAppointment",
}

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
    });
  }

  *CompleteAppointmentSaga(action: CompleteAppointmentActionsAction) {
    const payload = action.payload;

    yield call(
      this.xSave.bind(this),
      `/appointment-action/CompleteOperation`,
      payload,
      ActionReducer.Post,
    );
  }
  *watch() {
    yield takeLatest(
      AppointmentActionsActionSaga.CompleteAppointmentActions,
      this.CompleteAppointmentSaga.bind(this),
    );
  }
}
