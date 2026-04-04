import { OperationListActionSaga } from "../../FindingOperationList.Entity";

export interface GetActionsByTitlePayload {
  title: string;
  dentistryId: number;
}

export const GetActionsByTitle = (payload: GetActionsByTitlePayload) => ({
  type: OperationListActionSaga.GettingActionsByTitle,
  payload,
});

export type GetActionsByTitle = ReturnType<typeof GetActionsByTitle>;
