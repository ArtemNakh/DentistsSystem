

import * as Yup from "yup";

export const CreateLicenseSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    issue_date: Yup.date().required(
      t("admins.license.create_license.schema.issue_date_must"),
    ),
    issued_by: Yup.string().required(
      t("admins.license.create_license.schema.issued_by_must"),
    ),
    number_license: Yup.string().required(
      t("admins.license.create_license.schema.number_license_must"),
    ),
    expiration_date: Yup.date().required(
      t("admins.license.create_license.schema.expiration_date_must"),
    ),
  });
  