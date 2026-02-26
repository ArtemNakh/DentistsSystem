import { AppointmentActionSaga } from "../../Appointment.Entity";

interface GetAppointmentTodayDentistryPayload {
  dentistryId: number;
}

export const getAppointmentTodayDentistry = (
  payload: GetAppointmentTodayDentistryPayload,
) => ({
  type: AppointmentActionSaga.GetTodayOperationByDentistry as const,
  payload,
});

export type getAppointmentTodayDentistryAction = ReturnType<typeof getAppointmentTodayDentistry>;
