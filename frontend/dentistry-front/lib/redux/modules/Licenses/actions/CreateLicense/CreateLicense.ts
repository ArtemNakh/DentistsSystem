import { LicensesActionSaga } from "../../Licenses.Entity";

export interface CreateLicensePayload {
  workerId: number;
  issue_date: string;
  issued_by: string;
  number_license: string;
  expiration_date: string;
}

export const CreateLicense = (payload: CreateLicensePayload) => ({
  type: LicensesActionSaga.CreateLicense,
  payload,
});

export type CreateLicense = ReturnType<typeof CreateLicense>;
