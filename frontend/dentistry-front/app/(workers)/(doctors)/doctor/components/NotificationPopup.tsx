import React, { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useTranslation } from "react-i18next";
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { GetExpirationByWorker } from "@/lib/redux/modules/Licenses/actions/GetExpirationByWorker/GetExpirationByWorker";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export const NotificationPopup: React.FC = () => {
  const { t } = useTranslation();
  const maxDays = 30;
  const [expandedLicenses, setExpandedLicenses] = useState(true);
  const dispatch = useAppDispatch();
  const authUser: IWorker = UseDenormalizeSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const licenses = Object.values(
    UseDenormalizeSelector<ILicense[]>((state: RootState) => state.licenses),
  ).filter((license) => {
    // умова по стоматології
    const workerMatch = license.worker.id === authUser?.id;

    // умова по даті (наприклад, закінчується протягом maxDays)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxDays);

    const expirationMatch = new Date(license.expiration_date) <= maxDate;

    return workerMatch && expirationMatch;
  });

  // отримання усі сповіщення для стоматології у текущий день
  useEffect(() => {
    if (!authUser || !authUser?.dentistry?.id) {
      console.log("unauthorization user");
      return;
    }

    dispatch(
      GetExpirationByWorker({
        workerId: authUser.id,
        maxDays: maxDays,
      }),
    );
  },[]);

  return (
    <div className="absolute top-0 -right-10 mt-10 mr-10 w-96 bg-white border border-gray-300 rounded shadow-lg p-4 z-50">
      {/* Ліцензії */}
      <div className="mt-4 p-2 border-2 border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">
            {t("doctor.notification.licenses.licenses")}
          </h3>
          <button
            onClick={() => setExpandedLicenses(!expandedLicenses)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expandedLicenses
              ? t("doctor.notification.licenses.hide_block")
              : t("doctor.notification.licenses.show_block")}
          </button>
        </div>

        {expandedLicenses && (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {licenses.length === 0 ? (
              <li className="text-center text-gray-500">
                {t("doctor.notification.licenses.no_licenses")}
              </li>
            ) : (
              licenses.map((l) => (
                <li
                  key={l.id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50"
                >
                  <p className="font-semibold text-red-600">
                    {t("doctor.notification.licenses.license_number")}{" "}
                    {l.number_license}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("doctor.notification.licenses.expiration_date")}:{" "}
                    {new Date(l.expiration_date).toLocaleDateString("uk-UA")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("doctor.notification.licenses.issued_by")}:{l.issued_by}
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
