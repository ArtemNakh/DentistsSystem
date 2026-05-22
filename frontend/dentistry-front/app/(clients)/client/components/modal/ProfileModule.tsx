import Cookies from "js-cookie";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { logoutWorker } from "@/lib/redux/modules/AuthUser/actions/logoutAuthWorker/LogoutAuthWorker";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { useTranslation } from "react-i18next";

export default function ProfileDropdown({
  profileModule,
}: {
  profileModule: boolean;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutWorker({}));

    // очищаємо cookies
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    Cookies.remove("auth_token");
    Cookies.remove("role");

    // редірект на логін
    router.push("/c-auth/login");
  };

  return (
    <>
      {profileModule && (
        <div className="absolute top-full right-0 mt-3 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 z-50">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {t("client.header.settings.setting_profile")}
          </h3>
          <div className="relative">
            <LanguageSwitch
              buttonClassName="border border-gray-500 rounded px-2 py-1 mb-2 w-full text-gray-700 hover:bg-gray-300 transition"
              itemClassName="hover:bg-yellow-100 active:bg-yellow-200 border border-gray-500 p-1 mb-1 mx-1 rounded text-gray-700"
              dropdownClassName="absolute bg-white border-2 border-gray-200 rounded shadow-md"
              activeItemClassName="bg-yellow-100"
            />
            <button
              onClick={() => router.push("/client/profile")}
              className="text-gray-800 p-1 border border-gray-500 hover:bg-gray-300 ml-2 rounded active:bg-gray-400"
            >
              {t("client.header.settings.profile")}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 active:bg-yellow-600 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition-colors"
          >
            {t("client.header.settings.exit")}
          </button>
        </div>
      )}
    </>
  );
}
