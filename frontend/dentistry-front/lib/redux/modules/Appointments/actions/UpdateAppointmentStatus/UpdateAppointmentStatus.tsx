import { AppointmentActionSaga } from "../../Appointments.Entity";
import { StatusAppointment } from "../../Appointment.interface";

interface UpdateAppointmentStatusPayload {
  appointmentId: number;
  status: StatusAppointment;
}

export const UpdateAppointmentStatus = (
  payload: UpdateAppointmentStatusPayload,
) => ({
  type: AppointmentActionSaga.UpdateStatus,
  payload,
});

export type UpdateAppointmentStatusAction = ReturnType<
  typeof UpdateAppointmentStatus
>;
