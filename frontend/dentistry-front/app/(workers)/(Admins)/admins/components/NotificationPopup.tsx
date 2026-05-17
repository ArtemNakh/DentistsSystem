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
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { GetExpirationByDentistry } from "@/lib/redux/modules/Licenses/actions/GetExpirationByDentistry/GetExpirationByDentistry";

export const NotificationPopup: React.FC = () => {
  const { t } = useTranslation();
  const maxDays = 30;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedNotifications, setExpandedNotifications] = useState(true);
  const [expandedLicenses, setExpandedLicenses] = useState(true);
  const dispatch = useAppDispatch();
  const authUser: AuthState = UseDenormalizeSelector(
    (state: { auth: AuthState }) => state.auth,
  );

  const licenses = Object.values(
    UseDenormalizeSelector<ILicense[]>((state: RootState) => state.licenses),
  ).filter((license) => {
    // умова по стоматології
    const dentistryMatch =
      license.worker?.dentistry?.id === authUser.user?.dentistry.id;

    // умова по даті (наприклад, закінчується протягом maxDays)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxDays);

    const expirationMatch = new Date(license.expiration_date) <= maxDate;

    return dentistryMatch && expirationMatch;
  });

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
          t("admins.notification.notifications.type.remind_appointment") +
          `: ${n.appointment?.client?.surname ?? ""} ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      case TypeRemaind.PAYMENT_REMINDER:
        return (
          t("admins.notification.notifications.type.remind_payment") +
          `: ${n.appointment?.client?.surname ?? ""} ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      case TypeRemaind.PLANNED_APPOINTMENT:
        return (
          t("admins.notification.notifications.type.planned_appointment") +
          `: ${n.appointment?.dentist?.surname ?? ""}  ${n.appointment?.client?.name ?? ""} ${n.appointment?.client?.middle_name ?? ""}`
        );
      default:
        return t("admins.notification.notifications.type.general");
    }
  };

  // отримання усі сповіщення для стоматології у текущий день
  useEffect(() => {
    if (!authUser || !authUser?.user?.dentistry?.id) {
      console.log("unauthorization user");
      return;
    }

    dispatch(
      GetAllNotificationToday({ dentistryId: authUser.user?.dentistry.id }),
    );

    dispatch(
      GetExpirationByDentistry({
        dentistryId: authUser.user.dentistry.id,
        maxDays: maxDays,
      }),
    );
  });

  return (
    <div className="absolute top-0 -right-10 mt-10 mr-10 w-96 bg-white border border-gray-300 rounded shadow-lg p-4 z-50">
      {/* Сповіщення */}
      <div className="p-2 border-2 border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">
            {t("admins.notification.notifications.notification")}
          </h3>
          <button
            onClick={() => setExpandedNotifications(!expandedNotifications)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expandedNotifications
              ? t("admins.notification.notifications.hide_block")
              : t("admins.notification.notifications.show_block")}
          </button>
        </div>

        {expandedNotifications && (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="text-center text-gray-500">
                {t("admins.notification.notifications.no_notification")}
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === n.id ? null : n.id)
                  }
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
                    {`${t("admins.notification.notifications.text_notif")}: ${
                      expandedId === n.id
                        ? n.message
                        : n.message.slice(0, 50) + "..."
                    }`}
                  </p>
                  <button className="text-blue-600 text-sm mt-2 hover:underline">
                    {expandedId === n.id
                      ? t("admins.notification.notifications.hide")
                      : t("admins.notification.notifications.full")}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Ліцензії */}
      <div className="mt-4 p-2 border-2 border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">
            {t("admins.notification.licenses.licenses")}
          </h3>
          <button
            onClick={() => setExpandedLicenses(!expandedLicenses)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expandedLicenses
              ? t("admins.notification.licenses.hide_block")
              : t("admins.notification.licenses.show_block")}
          </button>
        </div>

        {expandedLicenses && (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {licenses.length === 0 ? (
              <li className="text-center text-gray-500">
                {t("admins.notification.licenses.no_licenses")}
              </li>
            ) : (
              licenses.map((l) => (
                <li
                  key={l.id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50"
                >
                  <p className="font-semibold text-red-600">
                    {t("admins.notification.licenses.license_number")}{" "}
                    {l.number_license}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("admins.notification.licenses.expiration_date")}:{" "}
                    {new Date(l.expiration_date).toLocaleDateString("uk-UA")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("admins.notification.licenses.worker")}:{" "}
                    {l.worker.surname} {l.worker.name} {l.worker.middle_name} (
                    {l.worker.specialty?.name})
                  </p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
