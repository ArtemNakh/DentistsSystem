import { LicensesActionSaga } from "../../Licenses.Entity";

export interface GetLicensesWorkersPayload {
  workerId: number;
}

export const GetLicensesWorker = (payload: GetLicensesWorkersPayload) => ({
  type: LicensesActionSaga.GetByIdWorker,
  payload,
});

export type GetLicensesWorker = ReturnType<typeof GetLicensesWorker>;
