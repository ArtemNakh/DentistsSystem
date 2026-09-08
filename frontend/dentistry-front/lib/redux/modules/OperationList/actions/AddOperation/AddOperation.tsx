import { OperationListActionSaga } from "../../OperationList.Entity";

export interface AddOperationPayload {
  name:string;
  description: string;
  price:number;
  active:boolean;
}

export const AddOperation = (payload: AddOperationPayload) => ({
  type: OperationListActionSaga.AddOperation as const,
  payload,
});

export type addNOperationAction = ReturnType<typeof AddOperation>;
