"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { format } from "date-fns";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { useTranslation } from "react-i18next";

export default function ClientProfile() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const client = authUser?.user as IClient;

  useEffect(() => {
    if (!authUser?.user) {
      dispatch(getAuthClient({}));
    }
  }, [dispatch, authUser?.user]);

  if (!client) {
    return (
      <div className="w-full px-4 py-6 text-center text-gray-600 text-sm sm:text-base">
        {t("client.profile.loading_profile")}...
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-6 py-4 sm:py-6">
      <div className="bg-white border border-amber-200 rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4 sm:mb-6 text-center sm:text-left">
          {t("client.profile.information")}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-gray-700 text-sm sm:text-base">
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.name")}:</span>{" "}
            {client.name}
          </div>
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.surname")}:</span>{" "}
            {client.surname}
          </div>
          {client.middle_name && (
            <div>
              <span className="font-medium text-amber-700">{t("client.profile.middle_name")}:</span>{" "}
              {client.middle_name}
            </div>
          )}
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.birthday")}:</span>{" "}
            {format(new Date(client.birthdate), "dd.MM.yyyy")}
          </div>
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.blood_group")}:</span>{" "}
            {client.blood_group}
          </div>
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.rh_factor")}:</span>{" "}
            {client.blood_resus === "plus" ? "+" : "-"}
          </div>
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.phone")}:</span>{" "}
            {client.phone}
          </div>
          <div>
            <span className="font-medium text-amber-700">{t("client.profile.email")}:</span>{" "}
            {client.email}
          </div>
          {client.allergic_diseases && (
            <div className="sm:col-span-2">
              <span className="font-medium text-amber-700">{t("client.profile.allergies")}:</span>{" "}
              {client.allergic_diseases}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
