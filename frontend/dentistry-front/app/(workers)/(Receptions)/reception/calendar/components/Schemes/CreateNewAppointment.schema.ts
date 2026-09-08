import * as Yup from "yup";
import i18n from "i18next";

export const CreateAppointmentSchema = Yup.object().shape({
  clientId: Yup.number()
    .required(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.client_id_must",
      ),
    )
    .positive(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.client_id_addition",
      ),
    )
    .integer(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.client_id_whole",
      ),
    ),
  dentistId: Yup.number()
    .required(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.dentist_id_must",
      ),
    )
    .positive(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.dentist_id_addition",
      ),
    )
    .integer(() =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.dentist_id_whole",
      ),
    ),
  appointment_date: Yup.date()
    .required(() =>
      i18n.t("reception.calendar.modal.adding_appointment.schema.data_must"),
    )
    .min(new Date(), () =>
      i18n.t(
        "reception.calendar.modal.adding_appointment.schema.data_not_past",
      ),
    ),
  notes: Yup.string()
    .max(500, () =>
      i18n.t("reception.calendar.modal.adding_appointment.schema.notes_max"),
    )
    .optional(),
});
