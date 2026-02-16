// import { normalize, schema } from "normalizr";
// import { IAppointment } from "./Appointment.interface";
// import { Entity } from "../../registry";
// import { AnyAction, PayloadAction } from "@reduxjs/toolkit";
// import { call, CallEffect, put, PutEffect, takeLatest } from "redux-saga/effects";

import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";

// export enum AppointmentActionSaga {
//   addAppointment = "appointment/add",
//   getAppointment = "appointment/get",
// }

// export enum AppointmentActionReducer {
//   Get = "GET",
//   Post = "POST",
// }

// const appointmentSchema = new schema.Entity("clients");
// const appointmentListSchema = [appointmentSchema];
// export type AppointmentState = Record<string, IAppointment>;

// @Entity({ name: "Appointments" })
// export class AppointmentEntity {
//   private initialState: AppointmentState = {};

//   public reducer = (
//     state: AppointmentState = this.initialState,
//     action: any,
//   ): AppointmentState => {
//     switch (action.type) {
//       case AppointmentActionReducer.Get:
//       case AppointmentActionReducer.Post: {
//         const newEntities = action.payload.entities?.clients as
//           | Record<string, IAppointment>
//           | undefined;
//         if (!newEntities) return state;

//         return {
//           ...state,
//           ...Object.entries(newEntities).reduce((acc, [id, rawData]) => {
//             acc[id] = { ...state[id], ...(rawData as IAppointment) };
//             return acc;
//           }, {} as AppointmentState),
//         };
//       }
//       default:
//         return state;
//     }
//   };

//   private async requestToDB(endpoint: string, method: string, data?: any) {
//     const res = await fetch(`http://localhost:4000/${endpoint}`, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       ...(data && { body: JSON.stringify(data) }),
//     });
//     const result = await res.json();
//     if (!res.ok) throw new Error(result.message);
//     return result;
//   }

//   /** Saga: отримати клієнтів */
//   public *getClientsSaga(
//     action: PayloadAction<void>,
//   ): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
//     try {
//       const result: any = yield call(
//         this.requestToDB,
//         "appointment/test/all",
//         "GET",
//       );
//       const normalized = normalize(result, appointmentListSchema);
//       yield put({ type: AppointmentActionReducer.Get, payload: normalized });
//     } catch (error) {
//       console.error("Get clients error:", error);
//     }
//   }

//   /** Watcher */
//   public *watch() {
//     yield takeLatest(
//       AppointmentActionSaga.getAppointment,
//       this.getClientsSaga.bind(this),
//     );
//     // yield takeLatest(ClientActionSaga.AddClient, this.addClientSaga.bind(this));
//   }
// }
import { format } from "date-fns";
import { PayloadAction } from "@reduxjs/toolkit";
export enum AppointmentActionSaga {
  GetAppointment = "Appointment/Getall",
  GetNearestToday = "Appointment/GetNearestToday",
  GetTodayOperation = "Appointment/GetToday",
}

@EntityReducer(EntitiesRedux.Appointments)
export class AppointmentEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Appointments, {
      client: new schema.Entity(EntitiesRedux.Clients),
      dentist: new schema.Entity(EntitiesRedux.Workers, {
        specialty: new schema.Entity(EntitiesRedux.Specialties),
        dentistry:new schema.Entity(EntitiesRedux.Dentistries)
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
      AppointmentActionSaga.GetTodayOperation, // це рядок "Appointment/GetCurrent"
      this.getTodayAppoinemntSaga.bind(this),
    );
  }
}
