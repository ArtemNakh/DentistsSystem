"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { SetNewPasswordClient } from "@/lib/redux/modules/AuthUser/actions/SetNewPasswordClient/SetNewPasswordClient";
import LanguageSwitch from "@/app/components/LanguageSwitch";

export default function NewPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // беремо токен зі строки URL
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatusMessage(t("new-password.token_not_found"));
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage(t("new-password.not_match"));
      return;
    }

    try {
      console.log("token", token, "pass", password);
      await dispatch(SetNewPasswordClient({ token, password }));
      setStatusMessage(t("new-password.change_pass_successfuly"));
    } catch (error: any) {
      setStatusMessage(t("new-password.error_change_pass"));
    }
  };

  return (
    <div className="flex items-center justify-center py-4 bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-end mb-2">
          <LanguageSwitch
            buttonClassName="rounded p-1 text-gray-700 hover:bg-gray-300 border border-gray-400"
            dropdownClassName="absolute mt-2 w-auto rounded-md shadow-lg border border-gray-600 bg-gray-300 text-gray-900"
            itemClassName="w-full px-2 py-2 text-sm hover:bg-gray-400"
            activeItemClassName="bg-gray-400 font-bold"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">
          {t("new-password.create_new_password")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2 "
            >
              {t("new-password.new_password")}
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400 text-gray-700 pr-10"
              placeholder={t("new-password.placeholder_new_password")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-900"
            >
              {!showPassword ? (
                <img
                  src="/eye-open.svg"
                  alt={t("loginClient.password.show")}
                  className=" w-5 h-5"
                />
              ) : (
                <img
                  src="/eye-closed.svg"
                  alt={t("loginClient.password.hide")}
                  className="h-5 w-5"
                />
              )}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("new-password.verify_password")}
            </label>
            <input
              id="confirmPassword"
              type={showRepeatPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400 text-gray-700"
              placeholder={t("new-password.repeat_password")}
              required
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-900"
            >
              {!showRepeatPassword ? (
                <img
                  src="/eye-open.svg"
                  alt={t("loginClient.password.show")}
                  className=" w-5 h-5"
                />
              ) : (
                <img
                  src="/eye-closed.svg"
                  alt={t("loginClient.password.hide")}
                  className="h-5 w-5"
                />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 "
            style={{ background: "linear-gradient(90deg,#FACC15,#EAB308)" }}
          >
            {t("new-password.change_password")}
          </button>
        </form>

        {statusMessage && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
