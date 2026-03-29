import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function MiddleNameRegistrationClientField() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t("registrationClient.middleName.title")}
        </label>

        <Field
          id="middle_name"
          name="middle_name"
          type="text"
          maxLength={100}
          className="w-full p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder={t("registrationClient.middleName.placeholder")}
        />
        <ErrorMessage
          name="middle_name"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
