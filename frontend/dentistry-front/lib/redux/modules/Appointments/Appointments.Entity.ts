import { schema } from "normalizr";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";
import { format } from "date-fns";
import { getAppointmentNearestTodayDentistryAction } from "./actions/GetNearestTodayByDentistry/GetNearestTodayByDentistry";
import { getAppointmentTodayDentistryAction } from "./actions/GetTodayOperationByDentistry/GetTodayOperationByDentistry";
import { getAppointmentsDentistryAction } from "./actions/GetAppointmentsDentistry/GetAppointmentsDentistry";
import { getHistoryAppointmentByDentistryAction } from "./actions/GetHistoryAppointmentDentistry/GetHistoryAppointmentDentistry";
import { addNewAppointmentAction } from "./actions/AddNewAppointment/AddNewAppointment";
import { GetAppointmentsByWorkerNext3MonthAction } from "./actions/GetAppointmentsByWorkerNext3Month/GetAppointmentsByWorkerNext3Month";
import { UpdateAppointmentStatusAction } from "./actions/UpdateAppointmentStatus/UpdateAppointmentStatus";
import HTTPMethod from "http-method-enum";
import { GetAppointmentsByIdAction as GetAppointmentByIdAction } from "./actions/GetById/GetAppointmentsById";
import { GetAppointmentsToClientAction } from "./actions/GetAppointmentsByClient/GetAppointmentsByClient";
import { GetAppointmentsByWorkerAction } from "./actions/GetAppointmentsByWorker/GetAppointmentsByWorker";

export enum AppointmentActionSaga {
  CreateAppointment = "Appointment/AddNew",
  GetNearestTodayByDentistry = "Appointment/GetNearestToday",
  GetTodayOperationByDentistry = "Appointment/GetTodayByDentistry",
  GetAppointmentsDentistry = "Appointment/GetToDentistry",
  GetHistoryByDentistry = "Appointment/GetHistoryByDentistry",
  getAppointmentsToWorker = "Appointment/GetToWorker",
  getAppointmentsToWorkerNext3Month = "Appointment/GetToWorkerNext3Month",
  UpdateStatus = "Appointment/UpdateStatus",
  GetById = "Appointment/GetById",
  GetToClient = "Appointment/GetToClient",
}

@EntityReducer(EntitiesRedux.Appointments)
export class AppointmentEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Appointments, {
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
    });
  }

  // Статичне поля для отримання схеми
  static schema = new AppointmentEntity(null).getSchema();

  *getNearestTodaySaga(action: getAppointmentNearestTodayDentistryAction) {
    const today = format(new Date(), "yyyy-MM-dd");

    yield call(
      this.xRead.bind(this),
      `/appointment/nearest?date=${today}&dentistryId=${action.payload.dentistryId}`,
      ActionReducer.Get,
    );
  }

  *getTodayAppoinemntSaga(action: getAppointmentTodayDentistryAction) {
    const { dentistryId } = action.payload;

    yield call(
      this.xRead.bind(this),
      `/appointment/today?dentistryId=${Number(dentistryId)}`,
      ActionReducer.Get,
    );
  }

  *getAppointmentsDentistrySaga(action: getAppointmentsDentistryAction) {
    const { dentistryId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/all?dentistryId=${dentistryId}`,
      ActionReducer.Get,
    );
  }

  *getHistoryByDentistrySaga(action: getHistoryAppointmentByDentistryAction) {
    const { dentistryId, take, skip } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/history?dentistryId=${dentistryId}&take=${take}&skip=${skip}`,
      ActionReducer.Get,
    );
  }

  *addNewAppointmentSaga(action: addNewAppointmentAction) {
    yield call(
      this.xSave.bind(this),
      `/appointment/add_new`,
      action.payload,
      ActionReducer.Post,
    );
  }

  *getAppointmentsToWorkerNewxt3monthSaga(
    action: GetAppointmentsByWorkerNext3MonthAction,
  ) {
    const { workerId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/${workerId}/appointments/next/3month`,
      ActionReducer.Get,
    );
  }

  *getAppointmentsToWorkerSaga(action: GetAppointmentsByWorkerAction) {
    const { workerId, take, skip } = action.payload;

    // базовий URL
    let url = `/appointment/${workerId}/appointments?`;

    // додаємо параметри тільки якщо вони є
    if (typeof take !== "undefined") {
      url += `&take=${take}`;
    }
    if (typeof skip !== "undefined") {
      url += `&skip=${skip}`;
    }

    yield call(this.xRead.bind(this), url, ActionReducer.Get);
  }
  
  *getAppointmentsToClientSaga(action: GetAppointmentsToClientAction) {
    const { clientId, take, skip } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/client/${clientId}?take=${take}&skip=${skip}`,
      ActionReducer.Get,
    );
  }

  *updateStatusSaga(action: UpdateAppointmentStatusAction) {
    const { appointmentId, status } = action.payload;
    yield call(
      this.xSave.bind(this),
      `/appointment/${appointmentId}/update_status`,
      { status },
      ActionReducer.Update,
      HTTPMethod.PATCH,
    );
  }

  *getByIdSaga(action: GetAppointmentByIdAction) {
    const { appointmentId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/appointment/${appointmentId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      AppointmentActionSaga.GetNearestTodayByDentistry,
      this.getNearestTodaySaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.GetTodayOperationByDentistry,
      this.getTodayAppoinemntSaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.GetAppointmentsDentistry,
      this.getAppointmentsDentistrySaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.GetHistoryByDentistry,
      this.getHistoryByDentistrySaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.CreateAppointment,
      this.addNewAppointmentSaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.getAppointmentsToWorkerNext3Month,
      this.getAppointmentsToWorkerNewxt3monthSaga.bind(this),
    );
    yield takeLatest(
      AppointmentActionSaga.getAppointmentsToWorker,
      this.getAppointmentsToWorkerSaga.bind(this),
    );
    yield takeLatest(
      AppointmentActionSaga.GetToClient,
      this.getAppointmentsToClientSaga.bind(this),
    );

    yield takeLatest(
      AppointmentActionSaga.UpdateStatus,
      this.updateStatusSaga.bind(this),
    );
    yield takeLatest(
      AppointmentActionSaga.GetById,
      this.getByIdSaga.bind(this),
    );
  }
}
