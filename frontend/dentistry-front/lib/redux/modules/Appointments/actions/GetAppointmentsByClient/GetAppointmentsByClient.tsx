import { AppointmentActionSaga } from "../../Appointments.Entity";

export interface GetAppointmentsToClientPayload {
  clientId: number;
  take: number;
  skip: number;
}

export const GetAppointmentsToClient = (
  payload: GetAppointmentsToClientPayload,
) => ({
  type: AppointmentActionSaga.GetToClient,
  payload,
});

export type GetAppointmentsToClientAction = ReturnType<
  typeof GetAppointmentsToClient
>;
