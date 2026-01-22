// validationSchemas.ts
import * as Yup from "yup";
import { BloodSign } from "../interfaces/RegisterClient.interface";

const RegistrationClientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "Ім'я має містити мінімум 3 символи")
    .max(50, "Ім'я не може перевищувати 50 символів")
    .required("Ім'я є обов'язковим"),

  surname: Yup.string()
    .trim()
    .min(2, "Прізвище має містити мінімум 2 символи")
    .max(50, "Прізвище не може перевищувати 50 символів")
    .required("Прізвище є обов'язковим"),

  middle_name: Yup.string()
    .trim()
    .min(2, "По-батькові  має містити мінімум 2 символи")
    .max(50, "По-батькові не може перевищувати 50 символів")
    .required("По-батькові є обов'язковим"),

  birthdate: Yup.date()
    .max(new Date(), "Дата народження не може бути в майбутньому")
    .required("Дата народження є обов'язковою"),

  blood_resus: Yup.mixed<BloodSign.minus | BloodSign.plus>()
    .oneOf([BloodSign.minus, BloodSign.plus], "Некоректний резус-фактор")
    .required("Резус-фактор є обов'язковим"),

  blood_group: Yup.number()
    .oneOf([1, 2, 3, 4], "Некоректна група крові")
    .required("Група крові є обов'язковою"),

  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Некоректний номер телефону")
    .required("Телефон є обов'язковим"),

  allergic_diseases: Yup.string()
    .max(255, "Опис алергій не може перевищувати 255 символів")
    .nullable(),

  email: Yup.string()
    .email("Некоректна електронна адреса")
    .required("Email є обов'язковим"),

  password: Yup.string()
    .min(8, "Пароль має містити мінімум 8 символів")
    .matches(/[A-Z]/, "Пароль має містити хоча б одну велику літеру")
    .matches(/[a-z]/, "Пароль має містити хоча б одну малу літеру")
    .matches(/[0-9]/, "Пароль має містити хоча б одну цифру")
    // .matches(/[@$!%*?&]/, "Пароль має містити хоча б один спецсимвол")
    .required("Пароль є обов'язковим"),

  passwordRepeat: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі мають співпадати")
    .required("Повтор пароля є обов'язковим"),
});

export default RegistrationClientValidationSchema;
