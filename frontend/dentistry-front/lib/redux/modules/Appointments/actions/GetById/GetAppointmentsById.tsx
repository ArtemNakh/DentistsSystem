import { AppointmentActionSaga } from "../../Appointments.Entity";

interface GetAppointmentByIdPayload {
  appointmentId: number;
}

export const GetAppointmentById = (payload: GetAppointmentByIdPayload) => ({
  type: AppointmentActionSaga.GetById ,
  payload,
});

export type GetAppointmentsByIdAction = ReturnType<typeof GetAppointmentById>;
