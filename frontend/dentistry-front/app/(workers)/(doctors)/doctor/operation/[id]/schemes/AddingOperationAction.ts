import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import * as Yup from "yup";

export const AddingOperationAction = Yup.object().shape({
  appointmentId: Yup.number()
    .required("Appointment ID є обов’язковим")
    .positive("Appointment ID має бути додатнім")
    .integer("Appointment ID має бути цілим числом"),
  actions: Yup.array()
    .of(
      Yup.number()
        .positive("Кожна дія має бути додатнім числом")
        .integer("Кожна дія має бути цілим числом"),
    )
    .required("Список дій є обов’язковим")
    .min(1, "Має бути хоча б одна дія"),
  method_pay: Yup.string()
    .required("Метод оплати є обов’язковим")
    .oneOf(
      [MethodPayment.CARD, MethodPayment.CASH, MethodPayment.TRANSFER],
      "Метод оплати має бути CARD, CASH або TRANSFER",
    ),
});
