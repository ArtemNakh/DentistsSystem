import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function LoginField() {
  const { t } = useTranslation();
  return (
    <div className=" text-gray-300 ">
      <label className="block mb-1 ">{t("loginWorker.login.title")}</label>
      <Field
        id="login"
        name="login"
        type="login"
        className="w-full p-2 border rounded focus:outline-none hover:border-gray-100 "
        placeholder={t("loginWorker.login.placeholder")}
      />
      <ErrorMessage
        name="login"
        component="div"
        className=" text-red-500  text-lg"
      />
    </div>
  );
}
