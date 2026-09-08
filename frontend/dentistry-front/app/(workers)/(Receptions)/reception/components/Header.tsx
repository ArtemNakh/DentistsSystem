"use client";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { useEffect, useState } from "react";
import SideBarAdmins from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { useTranslation } from "react-i18next";
import { logoutWorker } from "@/lib/redux/modules/AuthUser/actions/logoutAuthWorker/LogoutAuthWorker";
import { NotificationPopup } from "./NotificationPopup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function HeaderAdmin() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [profileModule, setProfileModule] = useState(false);
  const [leftSideBar, setLeftSideBar] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);

  const router = useRouter();
  useEffect(() => {
    if (auth.user) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  // список кнопок для сайдбару
  const sidebarItems = [
    {
      label: t("reception.header_side.pages.calendar"),
      path: "/reception/calendar",
    },
    {
      label: t("reception.header_side.pages.payment"),
      path: "/reception/payments",
    },
    {
      label: t("reception.header_side.pages.workers"),
      path: "/reception/workers",
    },
    {
      label: t("reception.header_side.pages.history_operation"),
      path: "/reception/historyOperations",
    },
  ];

  const handleLogout = async () => {
    await dispatch(logoutWorker({}));

    // очищаємо cookies
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("authToken");

    Cookies.remove("auth_token");
    Cookies.remove("role");

    // редірект на логін
    router.push("/w-auth/login");
  };

  return (
    <>
      <div className="bg-[#7E5BBA] border border-gray-600 ">
        <div className="flex items-center justify-between h-8">
          {/* left */}
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

            {/* сайдбар */}
            {leftSideBar && (
              <SideBarAdmins
                items={sidebarItems}
                onClose={() => setLeftSideBar(false)}
              />
            )}
          </div>

          <div>{t("reception.header.registry")}</div>

          {/* right */}
          <div className=" ml-auto flex  space-x-2 ">
            <div className="flex items-center space-x-2">
              <div className="relative">
                {/* Іконка сповіщень */}
                <button onClick={() => setShowPopup(!showPopup)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                {/* Поп‑ап */}
                {showPopup && <NotificationPopup />}
              </div>
            </div>

            {/* у випадаючому вікні додати можливість виходу */}
            <div className="flex relative ">
              <div
                onClick={() => setProfileModule(!profileModule)}
                className="flex items-center text-base mr-4 h-8"
              >
                <span className="flex items-center">
                  {auth.user?.surname} {auth.user?.name}{" "}
                  {auth.user?.middle_name}
                </span>
              </div>

              {profileModule && (
                <div className="absolute left-0 top-full border-2 border-gray-600 bg-[#7D5ABB] mt-1 px-1 w-auto h-auto">
                  <LanguageSwitch
                    buttonClassName="border border-gray-600 m-1  p-1 ml-0"
                    itemClassName="hover:bg-[#6D4FA3] active:bg-[#654896] border border-gray-600 p-1 mb-1 mx-1"
                    dropdownClassName="absolute bg-[#7D5ABB]  border-2 border-gray-600 "
                    activeItemClassName="bg-[#6D4FA3]"
                  />

                  <button
                   onClick={handleLogout}
                    className="border border-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition"
                  >
                    {t("reception.header.exit")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
