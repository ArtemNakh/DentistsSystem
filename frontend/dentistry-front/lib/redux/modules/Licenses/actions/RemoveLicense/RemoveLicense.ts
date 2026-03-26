// actions/RemoveLicense/RemoveLicense.ts
import { LicensesActionSaga } from "../../Licenses.Entity";

export interface RemoveLicensePayload {
  id: number;
}

export const RemoveLicense = (payload: RemoveLicensePayload) => ({
  type: LicensesActionSaga.RemoveLicense,
  payload,
});

export type RemoveLicense = ReturnType<typeof RemoveLicense>;
