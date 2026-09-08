import i18n from "@/i18next.config";
import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import * as Yup from "yup";

export const AddingOperationAction = Yup.object().shape({
  appointmentId: Yup.number()
    .required(i18n.t("doctor.operation.schema.appointment_id_must"))
    .positive(i18n.t("doctor.operation.schema.appointment_id_posit"))
    .integer(i18n.t("doctor.operation.schema.appointment_id_whole")),
  actions: Yup.array()
    .of(
      Yup.number()
        .positive(i18n.t("doctor.operation.schema.action_id_posit"))
        .integer(i18n.t("doctor.operation.schema.action_id_whole")),
    )
    .required(i18n.t("doctor.operation.schema.action_list_must"))
    .min(1, i18n.t("doctor.operation.schema.action_more_0")),
  method_pay: Yup.string()
    .required(i18n.t("doctor.operation.schema.method_pay_must"))
    .oneOf(
      [MethodPayment.CARD, MethodPayment.CASH, MethodPayment.TRANSFER],
      i18n.t("doctor.operation.schema.method_pay_way"),
    ),
});
