import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function PasswordField() {
  const { t } = useTranslation();
  return (
    <div className=" text-gray-300">
      <label className="block mb-1">{t("loginWorker.password.title")}</label>
      <Field
        id="password"
        name="password"
        type="password"
        className="w-full p-2 border rounded focus:outline-none hover:border-gray-100"
        placeholder={t("loginWorker.password.placeholder")}
      />
      <ErrorMessage
        name="password"
        component="div"
        className="text-red-500 text-lg"
      />
    </div>
  );
}
