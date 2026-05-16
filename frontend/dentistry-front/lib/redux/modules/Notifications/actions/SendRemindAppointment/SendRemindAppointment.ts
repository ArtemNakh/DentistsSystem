import { NotificationActionSaga } from "../../Notification.Entity";

export interface SendRemindAppointmentPayload {
  dentistryId: number;
}

export const SendRemindAppointment = (
  payload: SendRemindAppointmentPayload,
) => ({
  type: NotificationActionSaga.SendRemindAboutAppointment,
  payload,
});

export type SendRemindAppointmentAction = ReturnType<
  typeof SendRemindAppointment
>;
