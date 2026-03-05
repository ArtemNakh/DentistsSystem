import { ClientActionSaga } from "../../ClientEntity";

export interface GetClientsByFullNamePayload {
  fullName: string;
}

export const GetClientsByFullName = (payload: GetClientsByFullNamePayload) => ({
  type: ClientActionSaga.GetClientsByFullName,
  payload,
});

export type GetClientsByFullName = ReturnType<typeof GetClientsByFullName>;
