import { AppointmentActionSaga } from "../../Appointments.Entity";

interface GetAppointmentsDentistryPayload {
 dentistryId: number
}

export const getAppointmentDentistry = (
  payload: GetAppointmentsDentistryPayload,
) => ({
  type: AppointmentActionSaga.GetAppointmentsDentistry as const,
  payload,
});

export type getAppointmentsDentistryAction = ReturnType<typeof getAppointmentDentistry>;
