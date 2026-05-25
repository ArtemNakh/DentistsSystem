import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function SubmitAddingAppointment() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mx-5 mb-2 mt-4">
        <button
          type="submit"
          className="border w-full border-gray-400 rounded p-2  text-gray-600  bg-linear-to-r from-yellow-400 to-yellow-500
    hover:from-yellow-500 hover:to-yellow-600
    active:from-yellow-600 active:to-yellow-700"
        >
          
            {t("client.create_appointment.add")}
        </button>
      </div>
    </>
  );
}
