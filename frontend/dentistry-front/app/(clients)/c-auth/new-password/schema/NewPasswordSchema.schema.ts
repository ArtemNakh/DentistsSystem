import * as Yup from "yup";
import i18n from "i18next";
// Схема валідації

// Схема валідації
export const NewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, () => i18n.t("new-password.validation_min_length"))
    .max(100, () => i18n.t("password.validation_max_length"))
    .required(() => i18n.t("new-password.validation_required")),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], () => i18n.t("new-password.not_match"))
    .required(() => i18n.t("new-password.validation_confirm_required")),
});
