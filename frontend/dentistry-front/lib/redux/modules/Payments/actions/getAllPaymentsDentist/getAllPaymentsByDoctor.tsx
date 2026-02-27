import { PaymentActionSaga } from "../../Payments.Entity";

interface GetAllPaymentsDentistPayload {
  dentistId: number;
}

export const getAllPaymentsDentist = (
  payload: GetAllPaymentsDentistPayload,
) => ({ type: PaymentActionSaga.GetAllPaimentsDentist as const, payload });

export type AllPaymentsDentistAction = ReturnType<typeof getAllPaymentsDentist>;
