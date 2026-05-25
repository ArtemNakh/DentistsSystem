import * as Yup from "yup";
import { BloodSign } from "../interfaces/UpdateClient.interface";
import i18n from "i18next";

const UpdateClientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, () =>  i18n.t("error.registration_client.name.min"))
    .max(50, () =>  i18n.t("error.registration_client.name.max")),

  surname: Yup.string()
    .trim()
    .min(2, () =>  i18n.t("error.registration_client.surname.min"))
    .max(50, () =>  i18n.t("error.registration_client.surname.max")),

  middle_name: Yup.string()
    .trim()
    .min(2, () =>  i18n.t("error.registration_client.middleName.min"))
    .max(50, () =>  i18n.t("error.registration_client.middleName.max")),

  birthdate: Yup.date()
    .max(new Date(), () =>  i18n.t("error.registration_client.birthdate.max")),

  blood_resus: Yup.mixed<BloodSign.minus | BloodSign.plus>()
    .oneOf(
      [BloodSign.minus, BloodSign.plus],
      () =>  i18n.t("error.registration_client.bloodResus.invalid"),
    )
    .required(() =>  i18n.t("error.registration_client.bloodResus.required")),

  blood_group: Yup.number()
    .oneOf([1, 2, 3, 4], () =>  i18n.t("error.registration_client.bloodGroup.invalid")),

  phone: Yup.string()
    .matches(
      /^\+?[0-9]{10,20}$/,
      () =>  i18n.t("error.registration_client.phone.invalid"),
    ),

  allergic_diseases: Yup.string()
    .max(255, () =>  i18n.t("error.registration_client.allergicDiseases.max"))
    .nullable(),

  email: Yup.string()
    .email(() =>  i18n.t("error.registration_client.email.invalid")),

  password: Yup.string()
    .min(8, () =>  i18n.t("error.registration_client.password.min"))
    .matches(/[A-Z]/, () =>  i18n.t("error.registration_client.password.uppercase"))
    .matches(/[a-z]/, () =>  i18n.t("error.registration_client.password.lowercase"))
    .matches(/[0-9]/, () =>  i18n.t("error.registration_client.password.number")),

  passwordRepeat: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      () =>  i18n.t("error.registration_client.passwordRepeat.match"),
    ),
});

export default UpdateClientValidationSchema;
