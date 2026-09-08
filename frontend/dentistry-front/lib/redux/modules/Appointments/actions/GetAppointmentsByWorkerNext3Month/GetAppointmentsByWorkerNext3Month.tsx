import { AppointmentActionSaga } from "../../Appointments.Entity";

export interface GetAppointmentsByWorkerNext3monthPayload {
  workerId: number;
}

export const GetAppointmentsByWorkerNext3Month = (payload: GetAppointmentsByWorkerNext3monthPayload) => ({
  type: AppointmentActionSaga.getAppointmentsToWorkerNext3Month ,
  payload,
});

export type GetAppointmentsByWorkerNext3MonthAction = ReturnType<typeof GetAppointmentsByWorkerNext3Month>;
