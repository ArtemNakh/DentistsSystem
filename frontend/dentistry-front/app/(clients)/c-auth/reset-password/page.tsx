"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { ResetPasswordClient } from "@/lib/redux/modules/AuthUser/actions/ResetPasswordClient/ResetPasswordClient";
import LoginLink from "./components/LoginLink";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(ResetPasswordClient({ email }));
      setStatusMessage(t("інструкцію по зміненю паролю надіслано на пошту."));
    } catch (error: any) {
      setStatusMessage(t("Помилка: перевірте правильність email."));
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">
          {t("Відновлення паролю")}
        </h2>{" "}
        <LanguageSwitch
          buttonClassName="my-2 rounded p-1 text-gray-700 hover:bg-gray-300 border border-gray-400"
          dropdownClassName="absolute left-1/2 -translate-x-1/2 mt-2  w-auto rounded-md shadow-lg border border-gray-600 bg-gray-300 text-gray-900"
          itemClassName="w-full px-2 py-2 text-sm hover:bg-gray-400"
          activeItemClassName="bg-gray-400 font-bold"
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Введіть ваш email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700 placeholder:text-gray-400"
              placeholder="user@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105"
            style={{ background: "linear-gradient(90deg,#FACC15,#EAB308)" }}
          >
            {t("Надіслати запит")}
          </button>
        </form>
        {statusMessage && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {statusMessage}
          </p>
        )}
        <LoginLink />
      </div>
    </div>
  );
}
