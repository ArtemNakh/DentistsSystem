import { PaymentActionSaga } from "../../Payments.Entity";



interface GetPaymentsDentistryPayload {
  dentistryId: number;
}

export const getPaymentsDentistry = (
  payload: GetPaymentsDentistryPayload,
) => ({ type: PaymentActionSaga.GetPaymentsDentistry as const, payload });

export type PaymentsDentistryAction = ReturnType<typeof getPaymentsDentistry>;
