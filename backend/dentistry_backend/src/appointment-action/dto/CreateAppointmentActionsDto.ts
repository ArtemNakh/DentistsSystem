import { MethodPayment } from "src/payment/entity/payment.interface";

export class CreateAppointmentActionsDto {
  appointmentId: number;
  actions: number[]; // масив ID операцій
  method_pay: MethodPayment; // спосіб оплати
}
