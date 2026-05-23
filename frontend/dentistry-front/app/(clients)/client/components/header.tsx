"use client";
import { useEffect, useState } from "react";
import SideBarAdmins from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import ProfileDropdown from "./modal/ProfileModule";
import { RootState } from "@/lib/redux/store";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import Link from "next/link";

export default function HeaderClient() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: RootState }) => state.auth);
  const [leftSideBar, setLeftSideBar] = useState(false);
  const [profileModule, setProfileModule] = useState(false);
  // список кнопок для сайдбару
  const sidebarItems = [
    {
      label: t("client.header.pages.history_operation"),
      path: "/client/historyOperations",
    },
    {
      label: t("client.header.pages.create_appointment"),
      path: "/client/create-appointment",
    },
  ];
  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthClient({}));
  }, [dispatch]);

  return (
    <div className="bg-gray-400 border border-gray-600 z-30">
      <div className="flex items-center justify-between h-16 px-6 shadow-md">
        {/* Ліва кнопка */}
        {authUser.user && (
          <div>
            <button
              onClick={() => setLeftSideBar(true)}
              className="px-4 py-2 text-white rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {leftSideBar && (
              <SideBarAdmins
                items={sidebarItems}
                onClose={() => setLeftSideBar(false)}
              />
            )}
          </div>
        )}
        {/* Навігація справа */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/client/main"
            className="text-gray-900 font-medium hover:text-yellow-600 transition-colors"
          >
            {t("client.header.main")}
          </Link>
          <Link
            href="/client/about_us"
            className="text-gray-900 font-medium hover:text-yellow-600 transition-colors"
          >
            {t("client.header.about_us")}
          </Link>

          {/* Фото користувача */}
          {authUser.user && (
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500"
                onClick={() => setProfileModule(!profileModule)}
              >
                <img
                  src="/userAvatar.png"
                  alt="Фото користувача"
                  className="w-full h-full object-cover"
                />
              </div>
              {profileModule && (
                <ProfileDropdown profileModule={profileModule} />
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
