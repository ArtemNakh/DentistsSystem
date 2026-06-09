import { OperationListActionSaga } from "../../OperationList.Entity";

export interface GetActiveOperationListByDentistryPayload {
  dentistryId: number;
  take?: number;
  skip?: number;
}

export const GetActiveOperationListByDentistry = (
  payload: GetActiveOperationListByDentistryPayload,
) => ({
  type: OperationListActionSaga.GetAllActiveOperationsByDentistry,
  payload,
});

export type GetActiveOperationListByDentistryAction = ReturnType<
  typeof GetActiveOperationListByDentistry
>;
