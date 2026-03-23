import { LicensesActionSaga, LicensesEntity } from "../../Licenses.Entity";

export interface GetLicensesWorkersPayload {
    dentistryId: number;
    
}

export const GetLicensesWorkers = (payload: GetLicensesWorkersPayload) => ({
  type: LicensesActionSaga.GetLicensesWorkers,
  payload,
});

export type GetLicensesWorkers = ReturnType<typeof GetLicensesWorkers>;
