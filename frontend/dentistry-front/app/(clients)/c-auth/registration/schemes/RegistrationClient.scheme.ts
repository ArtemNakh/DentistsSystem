import * as Yup from "yup";
import { BloodSign } from "../interfaces/RegisterClient.interface";

const RegistrationClientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "error.registration_client.name.min")
    .max(50, "error.registration_client.name.max")
    .required("error.registration_client.name.required"),

  surname: Yup.string()
    .trim()
    .min(2, "error.registration_client.surname.min")
    .max(50, "error.registration_client.surname.max")
    .required("error.registration_client.surname.required"),

  middle_name: Yup.string()
    .trim()
    .min(2, "error.registration_client.middleName.min")
    .max(50, "error.registration_client.middleName.max")
    .required("error.registration_client.middleName.required"),

  birthdate: Yup.date()
    .max(new Date(), "error.registration_client.birthdate.max")
    .required("error.registration_client.birthdate.required"),

  blood_resus: Yup.mixed<BloodSign.minus | BloodSign.plus>()
    .oneOf(
      [BloodSign.minus, BloodSign.plus],
      "error.registration_client.bloodResus.invalid",
    )
    .required("error.registration_client.bloodResus.required"),

  blood_group: Yup.number()
    .oneOf([1, 2, 3, 4], "error.registration_client.bloodGroup.invalid")
    .required("error.registration_client.bloodGroup.required"),

  phone: Yup.string()
    .matches(/^\+?[0-9]{10,20}$/, "error.registration_client.phone.invalid")
    .required("error.registration_client.phone.required"),

  allergic_diseases: Yup.string()
    .max(255, "error.registration_client.allergicDiseases.max")
    .nullable(),

  email: Yup.string()
    .email("error.registration_client.email.invalid")
    .required("error.registration_client.email.required"),

  password: Yup.string()
    .min(8, "error.registration_client.password.min")
    .matches(/[A-Z]/, "error.registration_client.password.uppercase")
    .matches(/[a-z]/, "error.registration_client.password.lowercase")
    .matches(/[0-9]/, "error.registration_client.password.number")
    .required("error.registration_client.password.required"),

  passwordRepeat: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "error.registration_client.passwordRepeat.match",
    )
    .required("error.registration_client.passwordRepeat.required"),
});

export default RegistrationClientValidationSchema;
