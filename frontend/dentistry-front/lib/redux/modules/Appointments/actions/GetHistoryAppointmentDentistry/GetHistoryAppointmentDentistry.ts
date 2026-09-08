import { AppointmentActionSaga } from "../../Appointments.Entity";

interface GetHistoryAppointmentByDentistry {
  dentistryId: number;
  take?: number;
  skip?: number;
}

export const getHistoryAppointmentByDentistry = (
  payload: GetHistoryAppointmentByDentistry,
) => ({
  type: AppointmentActionSaga.GetHistoryByDentistry,
  payload,
});

export type getHistoryAppointmentByDentistryAction = ReturnType<
  typeof getHistoryAppointmentByDentistry
>;
