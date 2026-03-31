import * as Yup from "yup";
import i18n from "i18next";

export const CreateAppointmentSchema = Yup.object().shape({
  clientId: Yup.number()
    .required("Client ID є обов’язковим")
    .positive("Client ID має бути додатнім")
    .integer("Client ID має бути цілим числом"),
  dentistId: Yup.number()
    .required("Dentist ID є обов’язковим")
    .positive("Dentist ID має бути додатнім")
    .integer("Dentist ID має бути цілим числом"),
  appointment_date: Yup.date()
    .required("Дата прийому є обов’язковою")
    .min(new Date(), "Дата прийому не може бути в минулому"),
  notes: Yup.string()
    .max(500, "Нотатки не можуть перевищувати 500 символів")
    .optional(),
});
