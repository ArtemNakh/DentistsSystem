import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function AllergicDiseasesUpdateClientField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          {t("client.update-profile.allergicDiseases.title")}
        </label>
        <Field
          id="allergic_diseases"
          name="allergic_diseases"
          type="text"
          maxLength={255}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder={t("client.update-profile.allergicDiseases.placeholder")}
        />
        <ErrorMessage
          name="allergic_diseases"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
