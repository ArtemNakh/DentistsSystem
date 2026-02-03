// validationSchemas.ts
import * as Yup from "yup";
import i18n from "i18next";

const loginValidationSchema = Yup.object().shape({
  login: Yup.string()
    .required(() => i18n.t("error.loginWorker.loginField.required"))
    .min(5, () => i18n.t("error.loginWorker.loginField.min"))
    .max(100, () => i18n.t("error.loginWorker.loginField.max")),

  password: Yup.string()
    .required(() => i18n.t("error.loginWorker.password.required"))
    .min(5, () => i18n.t("error.loginWorker.password.min"))
    .max(100, () => i18n.t("error.loginWorker.password.max")),
});

export default loginValidationSchema;
