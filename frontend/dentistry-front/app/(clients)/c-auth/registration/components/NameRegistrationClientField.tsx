import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function NameRegistrationClientField() {
  const {t}=useTranslation()
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">{t("registrationClient.name.placeholder")}</label>
        <Field
          id="name"
          name="name"
          type="text"
          maxLength={100}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder={t("registrationClient.name.placeholder")}
        />
        <ErrorMessage
          name="name"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
