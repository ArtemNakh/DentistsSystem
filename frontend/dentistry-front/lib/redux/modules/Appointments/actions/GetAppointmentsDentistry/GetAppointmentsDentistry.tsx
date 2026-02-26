import { AppointmentActionSaga } from "../../Appointment.Entity";

interface GetAppointmentsDentistryPayload {
 dentistryId: number
}

export const getAppointmentNearestTodayDentistry = (
  payload: GetAppointmentsDentistryPayload,
) => ({
  type: AppointmentActionSaga.GetAppointmentsDentistry as const,
  payload,
});

export type getAppointmentsDentistryAction = ReturnType<typeof getAppointmentNearestTodayDentistry>;
