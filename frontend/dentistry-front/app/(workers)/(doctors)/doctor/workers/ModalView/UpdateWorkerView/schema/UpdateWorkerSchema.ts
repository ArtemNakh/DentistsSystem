import * as Yup from "yup";

export const UpdateWorkerSchema = Yup.object().shape({

  name: Yup.string()
    .required("Імʼя є обовʼязковим"),
  surname: Yup.string()
    .required("Прізвище є обовʼязковим"),
  middle_name: Yup.string()
    .required("По-батькові є обовʼязковим"),
  birthday: Yup.date()
    .required("Дата народження є обовʼязковою")
    .typeError("Невірний формат дати (YYYY-MM-DD)"),
  phone: Yup.string()
    .required("Телефон є обовʼязковим")
    .matches(/^\+?\d{10,15}$/, "Невірний формат телефону"),
  specialtyId: Yup.number()
    .required("Оберіть спеціальність")
    .min(1, "Оберіть спеціальність"),
  dentistryId: Yup.number()
    .required("ID стоматології є обовʼязковим")
    .min(1, "Оберіть стоматологію"),
  login: Yup.string()
    .required("Логін є обовʼязковим"),
  password: Yup.string()
    .required("Пароль є обовʼязковим")
    .min(6, "Пароль має містити мінімум 6 символів"),
    active: Yup.boolean()
  .required("Статус активності є обовʼязковим"),

});
