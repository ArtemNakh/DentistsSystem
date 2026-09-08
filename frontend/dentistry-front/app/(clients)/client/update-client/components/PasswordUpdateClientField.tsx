import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PasswordUpdateClientField() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          {t("client.update-profile.password.title")}
        </label>
        <div className="relative">
          <Field
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            maxLength={100}
            className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 pr-10"
            placeholder={t("client.update-profile.password.placeholder")}
          />
          {/* Кнопка для перемикання */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? (
              <img
                src="/eye-open.svg"
                alt={t("loginClient.password.show")}
                className="h-5 w-5"
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

        <ErrorMessage
          name="password"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
