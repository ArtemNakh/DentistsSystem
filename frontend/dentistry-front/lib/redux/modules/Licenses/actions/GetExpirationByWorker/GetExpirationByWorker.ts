import { LicensesActionSaga } from "../../Licenses.Entity";

export interface GetExpirationByWorkerPayload {
  workerId: number;
  maxDays: number;
}

export const GetExpirationByWorker = (
  payload: GetExpirationByWorkerPayload,
) => ({
  type: LicensesActionSaga.GetExpirationLicensesWorker,
  payload,
});

export type GetExpirationByWorkerAction = ReturnType<
  typeof GetExpirationByWorker
>;
