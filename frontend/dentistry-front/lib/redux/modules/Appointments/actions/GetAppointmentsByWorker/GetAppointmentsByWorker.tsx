import { AppointmentActionSaga } from "../../Appointments.Entity";

export interface GetAppointmentsToWorkerPayload {
  workerId: number;
}

export const GetAppointmentsToWorker = (payload: GetAppointmentsToWorkerPayload) => ({
  type: AppointmentActionSaga.getAppointmentsToWorker ,
  payload,
});

export type GetAppointmentsToWorkerAction = ReturnType<typeof GetAppointmentsToWorker>;
