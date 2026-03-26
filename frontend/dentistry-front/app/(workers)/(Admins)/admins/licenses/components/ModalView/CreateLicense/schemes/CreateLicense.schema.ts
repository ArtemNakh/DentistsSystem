import * as Yup from "yup";
export const CreateLicenseSchema = Yup.object().shape({
  issue_date: Yup.date().required("Дата видачі обовʼязкова"),
  issued_by: Yup.string().required("Орган видачі обовʼязковий"),
  number_license: Yup.string().required("Номер ліцензії обовʼязковий"),
  expiration_date: Yup.date().required("Дата закінчення обовʼязкова"),
});
