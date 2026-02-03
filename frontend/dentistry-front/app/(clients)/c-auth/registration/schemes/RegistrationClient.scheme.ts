import * as Yup from "yup";
import { BloodSign } from "../interfaces/RegisterClient.interface";
import i18n from "i18next";

const RegistrationClientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, () =>  i18n.t("error.registration_client.name.min"))
    .max(50, () =>  i18n.t("error.registration_client.name.max"))
    .required(() =>  i18n.t("error.registration_client.name.required")),

  surname: Yup.string()
    .trim()
    .min(2, () =>  i18n.t("error.registration_client.surname.min"))
    .max(50, () =>  i18n.t("error.registration_client.surname.max"))
    .required(() =>  i18n.t("error.registration_client.surname.required")),

  middle_name: Yup.string()
    .trim()
    .min(2, () =>  i18n.t("error.registration_client.middleName.min"))
    .max(50, () =>  i18n.t("error.registration_client.middleName.max"))
    .required(() =>  i18n.t("error.registration_client.middleName.required")),

  birthdate: Yup.date()
    .max(new Date(), () =>  i18n.t("error.registration_client.birthdate.max"))
    .required(() =>  i18n.t("error.registration_client.birthdate.required")),

  blood_resus: Yup.mixed<BloodSign.minus | BloodSign.plus>()
    .oneOf(
      [BloodSign.minus, BloodSign.plus],
      () =>  i18n.t("error.registration_client.bloodResus.invalid"),
    )
    .required(() =>  i18n.t("error.registration_client.bloodResus.required")),

  blood_group: Yup.number()
    .oneOf([1, 2, 3, 4], () =>  i18n.t("error.registration_client.bloodGroup.invalid"))
    .required(() =>  i18n.t("error.registration_client.bloodGroup.required")),

  phone: Yup.string()
    .matches(
      /^\+?[0-9]{10,20}$/,
      () =>  i18n.t("error.registration_client.phone.invalid"),
    )
    .required(() =>  i18n.t("error.registration_client.phone.required")),

  allergic_diseases: Yup.string()
    .max(255, () =>  i18n.t("error.registration_client.allergicDiseases.max"))
    .nullable(),

  email: Yup.string()
    .email(() =>  i18n.t("error.registration_client.email.invalid"))
    .required(() =>  i18n.t("error.registration_client.email.required")),

  password: Yup.string()
    .min(8, () =>  i18n.t("error.registration_client.password.min"))
    .matches(/[A-Z]/, () =>  i18n.t("error.registration_client.password.uppercase"))
    .matches(/[a-z]/, () =>  i18n.t("error.registration_client.password.lowercase"))
    .matches(/[0-9]/, () =>  i18n.t("error.registration_client.password.number"))
    .required(() =>  i18n.t("error.registration_client.password.required")),

  passwordRepeat: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      () =>  i18n.t("error.registration_client.passwordRepeat.match"),
    )
    .required(() =>  i18n.t("error.registration_client.passwordRepeat.required")),
});

export default RegistrationClientValidationSchema;
