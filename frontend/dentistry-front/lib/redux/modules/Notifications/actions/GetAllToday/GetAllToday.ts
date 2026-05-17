import { NotificationActionSaga } from "../../Notification.Entity";

export interface GetAllNotificationTodayPayload {
  dentistryId: number;
}

export const GetAllNotificationToday = (
  payload: GetAllNotificationTodayPayload,
) => ({
  type: NotificationActionSaga.getAllToday,
  payload,
});

export type getAllNotificationTodayAction = ReturnType<
  typeof GetAllNotificationToday
>;
