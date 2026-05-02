

import * as Yup from "yup";

export const CreateLicenseSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    issue_date: Yup.date().required(
      t("admin.licenses.adding.shema.issue_date_must"),
    ),
    issued_by: Yup.string().required(
      t("admin.licenses.adding.shema.issued_by_must"),
    ),
    number_license: Yup.string().required(
      t("admin.licenses.adding.shema.number_license_must"),
    ),
    expiration_date: Yup.date().required(
      t("admin.licenses.adding.shema.expiration_date_must"),
    ),
  });
// "schema": {
//           "issue_date_must": "Дата видачі обовʼязкова",
//           "issued_by_must": "Орган видачі обовʼязковий",
//           "number_license_must": "Номер ліцензії обовʼязковий",
//           "expiration_date_must": "Дата закінчення обовʼязкова"
//         }