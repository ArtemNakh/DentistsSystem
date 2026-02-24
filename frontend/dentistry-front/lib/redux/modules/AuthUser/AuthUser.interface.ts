import { IClient } from "../Clients/clients.interface";
import { IWorker } from "../Workers/Workers.interface";



export type AuthUser = IWorker | IClient;
export interface AuthState {
  user: AuthUser | null;
}
