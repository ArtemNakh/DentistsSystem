import i18n from "@/i18next.config";
import * as Yup from "yup";

export const CreateWorkerSchema = Yup.object().shape({
  name: Yup.string().required(() =>
    i18n.t("admins.workers.create_worker.schema.name_must"),
  ),
  surname: Yup.string().required(() =>
    i18n.t("admins.workers.create_worker.schema.surname_must"),
  ),
  middle_name: Yup.string().required(() =>
    i18n.t("admins.workers.create_worker.schema.middle_name"),
  ),
  birthday: Yup.date()
    .required(() => i18n.t("admins.workers.create_worker.schema.birthday_must"))
    .typeError(() =>
      i18n.t("admins.workers.create_worker.schema.uncorrect_format_birthday"),
    ),
  phone: Yup.string()
    .required(() => i18n.t("admins.workers.create_worker.schema.phone_must"))
    .matches(/^\+?\d{10,15}$/, () =>
      i18n.t("admins.workers.create_worker.schema.uncorrect_format_phone"),
    ),
  specialtyId: Yup.number()
    .required(() =>
      i18n.t("admins.workers.create_worker.schema.choose_specialization"),
    )
    .min(1, () =>
      i18n.t("admins.workers.create_worker.schema.must_more_specialization"),
    ),
  dentistryId: Yup.number()
    .required(() =>
      i18n.t("admins.workers.create_worker.schema.doctor_id_must"),
    )
    .min(1, () => i18n.t("admins.workers.create_worker.schema.choose_doctor")),
  login: Yup.string().required(() =>
    i18n.t("admins.workers.create_worker.schema.login_must"),
  ),
  password: Yup.string()
    .required(() => i18n.t("admins.workers.create_worker.schema.password_must"))
    .min(6, () =>
      i18n.t("admins.workers.create_worker.schema.more_6_password"),
    ),
});
