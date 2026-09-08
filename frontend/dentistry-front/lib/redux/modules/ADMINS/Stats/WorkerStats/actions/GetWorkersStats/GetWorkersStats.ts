
import { WorkerStatsActionSaga } from "../../WorkerStats.entity";

export interface GetWorkersAppointmentStatsPayload {
  dentistryId:number
    
}

export const GetWorkersAppointmentStats = (payload: GetWorkersAppointmentStatsPayload) => ({
  type: WorkerStatsActionSaga.GetWorkersStats,
  payload,
});

export type GetWorkersAppointmentStatsAction = ReturnType<typeof GetWorkersAppointmentStats>;
