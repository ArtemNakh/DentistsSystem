import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { AppointmentActionsActionSaga } from "../../../AppointmentActions.Entity";

export interface CompleteAppointmentActionsPayload {
  appointmentId: number;
  actions: number[]; // масив ID операцій
  method_pay: MethodPayment; // обмежений набір значень
}

export const CompleteAppointmentActions = (
  payload: CompleteAppointmentActionsPayload,
) => ({
  type: AppointmentActionsActionSaga.CompleteAppointmentActions,
  payload,
});

export type CompleteAppointmentActionsAction = ReturnType<
  typeof CompleteAppointmentActions
>;
