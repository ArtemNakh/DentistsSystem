import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function BirthdayRegistrationClientField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          {t("registrationClient.birthday.title")}
        </label>
        <Field
          id="birthdate"
          name="birthdate"
          type="date"
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder=  {t("registrationClient.birthday.placeholder")}
        />
        <ErrorMessage
          name="birthdate"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
