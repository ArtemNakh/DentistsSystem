import * as Yup from "yup";
import i18n from "i18next";

export const CreateAppointmentSchema = Yup.object().shape({
  clientId: Yup.number()
    .required(() => i18n.t("client.create_appointment.validation.clientId.required"))
    .positive(() => i18n.t("client.create_appointment.validation.clientId.positive"))
    .integer(() => i18n.t("client.create_appointment.validation.clientId.integer")),
  dentistId: Yup.number()
    .required(() => i18n.t("client.create_appointment.validation.dentistId.required"))
    .positive(() => i18n.t("client.create_appointment.validation.dentistId.positive"))
    .integer(() => i18n.t("client.create_appointment.validation.dentistId.integer")),
  appointment_date: Yup.date()
    .required(() => i18n.t("client.create_appointment.validation.appointment_date.required"))
    .min(new Date(), () => i18n.t("client.create_appointment.validation.appointment_date.min")),
  notes: Yup.string()
    .max(500, () => i18n.t("client.create_appointment.validation.notes.max"))
    .optional(),
});
