import { LicensesActionSaga, LicensesEntity } from "../../Licenses.Entity";

export interface GetExpirationByDentistryPayload {
    dentistryId: number;
    maxDays:number
}

export const GetExpirationByDentistry = (payload: GetExpirationByDentistryPayload) => ({
  type: LicensesActionSaga.GetExpirationByDentistry,
  payload,
});

export type GetExpirationByDentistryAction = ReturnType<typeof GetExpirationByDentistry>;
