import { PaymentActionSaga } from "../../Payments.Entity";

interface CompletePaymentByAppointmentIdPayload {
  appointmentId: number;
 
}

export const completePaymentByAppointmentID = (payload: CompletePaymentByAppointmentIdPayload) => ({
  type: PaymentActionSaga.CompletePaymentByAppointmentId as const,
  payload,
});

export type CompletePaymentAction = ReturnType<typeof completePaymentByAppointmentID>;
