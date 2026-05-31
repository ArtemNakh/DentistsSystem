import React, { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import {
  INotification,
  TypeRemaind,
} from "@/lib/redux/modules/Notifications/Notification.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { GetAllNotificationToday } from "@/lib/redux/modules/Notifications/actions/GetAllToday/GetAllToday";
import { useTranslation } from "react-i18next";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export const NotificationPopup: React.FC = () => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const authUser: IWorker = UseDenormalizeSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  // денормалізація масиву сповіщень
  const notifications: INotification[] = Object.values(
    UseDenormalizeSelector<INotification[]>(
      (state: RootState) => state.notifications,
    ),
  ).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const getTitle = (n: INotification) => {
    switch (n.type_remaind) {
      case TypeRemaind.APPOINTMENT_REMINDER:
        return (
          t("admins.notification.type.remind_appointment") +
          `: ${n.appointment?.client?.surname ?? ""} ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      case TypeRemaind.PAYMENT_REMINDER:
        return (
          t("admins.notification.type.remind_payment") +
          `: ${n.appointment?.client?.surname ?? ""} ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      case TypeRemaind.PLANNED_APPOINTMENT:
        return (
          t("admins.notification.type.planned_appointment") +
          `: ${n.appointment?.dentist?.surname ?? ""}  ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      default:
        return t("admins.notification.type.general");
    }
  };

  // отримання усі сповіщення для стоматології у текущий день
  useEffect(() => {
    if (!authUser || !authUser?.dentistry?.id) {
      console.log("unauthorization user");
      return;
    }

    dispatch(
      GetAllNotificationToday({ dentistryId: authUser?.dentistry.id }),
    );
  },[authUser]);

  return (
    <div className="absolute top-0 -right-10 mt-10 mr-10 w-96 bg-white border border-gray-300 rounded shadow-lg p-4 z-50">
      <h3 className="font-bold text-gray-800 mb-3">
        {t("admins.notification.notification")}
      </h3>
      <ul className="space-y-3  max-h-120 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="text-center text-gray-500">
            {t("admins.notification.no_notification")}
          </li>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}
            >
              <p className="font-semibold text-gray-700">{getTitle(n)}</p>
              <p className="text-sm text-gray-500">
                {new Date(n.created_at).toLocaleString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {`${t("admins.notification.text_notif")}: ${
                  expandedId === n.id
                    ? n.message
                    : n.message.slice(0, 50) + "..."
                }`}
              </p>

              <button className="text-blue-600 text-sm mt-2 hover:underline">
                {expandedId === n.id
                  ? t("admins.notification.hide")
                  : t("admins.notification.full")}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
