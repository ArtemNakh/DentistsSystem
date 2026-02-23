import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";

import { format } from "date-fns";
import { PayloadAction } from "@reduxjs/toolkit";

export enum AppointmentActionSaga {
  GetAppointment = "Appointment/Getall",
  GetNearestToday = "Appointment/GetNearestToday",
  GetTodayOperation = "Appointment/GetToday",
  GetAppointmentsDentistry = "Appointment/GetToDentistry",
}

interface GetAppointmentsDentistryPayload {
  dentistryId: number;
}

export type AppointmentsActions = {
  type: AppointmentActionSaga.GetAppointmentsDentistry;
  payload: GetAppointmentsDentistryPayload;
};

@EntityReducer(EntitiesRedux.Appointments)
export class AppointmentEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Appointments, {
      client: new schema.Entity(EntitiesRedux.Clients),
      dentist: new schema.Entity(EntitiesRedux.Workers, {
        specialty: new schema.Entity(EntitiesRedux.Specialties),
        dentistry: new schema.Entity(EntitiesRedux.Dentistries),
      }),
    });
  }

  *getAppointmentSaga() {
    yield call(
      this.xRead.bind(this),
      `/appointment/test/all`,
      ActionReducer.Get,
    );
  }

  *getNearestTodaySaga() {
    const today = format(new Date(), "yyyy-MM-dd"); // 2026-02-13

    yield call(
      this.xRead.bind(this),
      // `/appointment/nearest?date=${today}`, where appointment_date=2026-03-01
      `/appointment/nearest?date=${today}`,
      ActionReducer.Get,
    );
  }

  *getTodayAppoinemntSaga(action: PayloadAction<{ workerId: number }>) {
    const { workerId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/today?worker=${workerId}`,
      ActionReducer.Get,
    );
  }

  *getAppointmentsDentistrySaga(
    action: Extract<
      AppointmentsActions,
      { type: AppointmentActionSaga.GetAppointmentsDentistry }
    >,
  ) {
    const { dentistryId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/all?dentistry=${dentistryId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      AppointmentActionSaga.GetAppointment,
      this.getAppointmentSaga.bind(this),
    );
    yield takeLatest(
      AppointmentActionSaga.GetNearestToday,
      this.getNearestTodaySaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.GetTodayOperation, 
      this.getTodayAppoinemntSaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.GetAppointmentsDentistry,
      this.getAppointmentsDentistrySaga.bind(this),
    );
  }
}
