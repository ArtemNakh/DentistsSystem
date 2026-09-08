import { AppointmentActionSaga } from "../../Appointments.Entity";

interface GetAppointmentTodayDentistryPayload {
 dentistryId: number
}

export const getAppointmentNearestTodayDentistry = (
  payload: GetAppointmentTodayDentistryPayload,
) => ({
  type: AppointmentActionSaga.GetNearestTodayByDentistry as const,
  payload,
});

export type getAppointmentNearestTodayDentistryAction = ReturnType<typeof getAppointmentNearestTodayDentistry>;
