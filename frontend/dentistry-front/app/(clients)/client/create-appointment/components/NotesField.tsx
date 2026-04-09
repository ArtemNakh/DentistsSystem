import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function NotesField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-600">
          {t("reception.calendar.modal.adding_appointment.notes.name")}
        </label>
        <Field
          id="notes"
          name="notes"
          type="text"
          maxLength={100}
          className="w-full p-2 text-gray-600 border border-gray-400 placeholder-gray-400 rounded  focus:outline-none hover:border-gray-950 "
          placeholder={t(
            "reception.calendar.modal.adding_appointment.notes.placeholder",
          )}
        />
        <ErrorMessage
          name="notes"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
