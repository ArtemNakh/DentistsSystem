import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function EmailUpdateClientField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          {t("client.update-profile.email.title")}
        </label>
        <Field
          id="email"
          name="email"
          type="email"
          maxLength={100}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder={t("client.update-profile.email.placeholder")}
        />
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
