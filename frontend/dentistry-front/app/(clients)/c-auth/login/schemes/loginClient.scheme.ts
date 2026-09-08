// validationSchemas.ts
import * as Yup from "yup";
import { ILoginClient } from "../interfaces/LoginClient.interface";
import i18n from "i18next";
const loginClientValidationSchema: Yup.ObjectSchema<ILoginClient> =
  Yup.object().shape({
    email: Yup.string()
      .required(() => i18n.t("error.loginClient.email.required"))
      .min(5, () => i18n.t("error.loginClient.email.min"))
      .max(100, () => i18n.t("error.loginClient.email.max"))
      .email(() => i18n.t("error.loginClient.email.invalid")),
    password: Yup.string()
      .required(() => i18n.t("error.loginClient.password.required"))
      .min(5, () => i18n.t("error.loginClient.password.min"))
      .max(100, () => i18n.t("error.loginClient.password.max")),
  });

export default loginClientValidationSchema;
