import { OperationListActionSaga } from "../../OperationList.Entity";

export interface UpdateOperationPayload {
  operationId: number;
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
}

export const UpdateOperation = (payload: UpdateOperationPayload) => ({
  type: OperationListActionSaga.UpdateOperation as const,
  payload,
});

export type UpdateOperationAction = ReturnType<typeof UpdateOperation>;
