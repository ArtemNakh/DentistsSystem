import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PasswordField() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className=" text-gray-300">
      <label className="block mb-1">{t("loginWorker.password.title")}</label>
      <div className="relative">
        <Field
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          className="w-full p-2 border rounded focus:outline-none hover:border-gray-100"
          placeholder={t("loginWorker.password.placeholder")}
        />
         <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? (
              <img
                src="/eye-closed.svg"
                alt={t("loginClient.password.hide")}
                className="h-5 w-5"
              />
            ) : (
              <img
                src="/eye-open.svg"
                alt={t("loginClient.password.show")}
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
  );
}
