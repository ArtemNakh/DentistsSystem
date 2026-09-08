import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function EmailClientLoginField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5   text-gray-700 mb-3 ">
        <label className="block mb-1 text-lg ">{t("loginClient.email.label")}</label>
        <Field
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder={t("loginClient.email.placeholder")}
        />
        <ErrorMessage
          name="email"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
