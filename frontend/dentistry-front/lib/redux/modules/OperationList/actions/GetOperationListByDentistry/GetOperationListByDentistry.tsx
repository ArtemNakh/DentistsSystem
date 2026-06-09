import { OperationListActionSaga } from "../../OperationList.Entity";

export interface GetOperationListByDentistryPayload {
  dentistryId: number;
  take?: number;
  skip?: number;
}

export const GetOperationListByDentistry = (
  payload: GetOperationListByDentistryPayload,
) => ({
  type: OperationListActionSaga.GetAllOperationsByDentistry,
  payload,
});

export type GetOperationListByDentistryAction = ReturnType<
  typeof GetOperationListByDentistry
>;
