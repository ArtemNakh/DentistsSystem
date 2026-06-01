import { AppointmentActionSaga } from "../../Appointments.Entity";

export interface GetAppointmentsByWorkerPayload {
  workerId: number;
  take?: number;
  skip?: number;
}

export const GetAppointmentsByWorker = (
  payload: GetAppointmentsByWorkerPayload,
) => ({
  type: AppointmentActionSaga.getAppointmentsToWorker,
  payload,
});

export type GetAppointmentsByWorkerAction = ReturnType<
  typeof GetAppointmentsByWorker
>;
