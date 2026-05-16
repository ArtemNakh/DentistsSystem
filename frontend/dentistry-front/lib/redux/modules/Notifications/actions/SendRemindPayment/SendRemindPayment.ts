import { NotificationActionSaga } from "../../Notification.Entity";

export interface SendRemindPaymentPayload {
  dentistryId: number;
}

export const SendRemindPayment = (payload: SendRemindPaymentPayload) => ({
  type: NotificationActionSaga.SendRemindPayment,
  payload,
});

export type SendRemindPaymentAction = ReturnType<typeof SendRemindPayment>;
