import { AppointmentActionSaga } from "../../Appointments.Entity";

export interface AddNewAppointmentPayload {
  clientId: number;
  dentistId: number;
  appointment_date: string;
  notes?: string;
}

export const AddNewAppointment = (payload: AddNewAppointmentPayload) => ({
  type: AppointmentActionSaga.CreateAppointment as const,
  payload,
});

export type addNewAppointmentAction = ReturnType<typeof AddNewAppointment>;
