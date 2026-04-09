import { FindingWorkersActionSaga } from "../../FindingWorkerEntity";

export interface GetWorkersByFullNamePayload {
  fullName: string;
  dentistryId: number;
}

export const GetWorkersByFullName = (payload: GetWorkersByFullNamePayload) => ({
  type: FindingWorkersActionSaga.GetWorkersByFullName,
  payload,
});

export type GetWorkersByFullName = ReturnType<typeof GetWorkersByFullName>;
